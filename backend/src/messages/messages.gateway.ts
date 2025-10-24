import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/users/entities/user.entity';
import { AuthenticatedSocket, JwtPayload } from 'src/common/types/auth';

@WebSocketGateway()
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');

  constructor(
    private readonly messagesService: MessagesService,
    private jwtService: JwtService,
  ) { }

  afterInit() {
    this.logger.log('Message socket initialised');
  }

  handleConnection(client: AuthenticatedSocket) {
    const token: string = client.handshake.auth.token as string;
    if (!token) {
      client.disconnect();
      this.logger.warn('Connection rejected: No token provided');
      return;
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      if (![UserRole.DOCTOR, UserRole.PATIENT].includes(payload.role)) {
        client.emit('auth_error', { message: 'Forbidden role' });
        client.disconnect(true);
        this.logger.warn(`Connection rejected: Invalid role ${payload.role}`);
        return;
      }
      client.data.user = payload;
      this.logger.log(`Connected: ${payload.email}`);
    } catch (error) {
      client.disconnect();
      this.logger.warn('Connection rejected: Invalid token', error);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.data.user?.email}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { receiverId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const sender = client.data.user;
    const senderRole: UserRole = sender.role;
    const room =
      senderRole === UserRole.DOCTOR
        ? `room-${sender.sub}-${data.receiverId}`
        : `room-${data.receiverId}-${sender.sub}`;

    await client.join(room);
    client.data.room = room;

    this.logger.log(`Joined room: ${room}`);

    // Fetch previous messages
    const previousMessages = await this.messagesService.findByRoom(room);
    const messages = previousMessages.map((m) => ({
      senderId: m.sender.id,
      name: m.sender.full_name,
      message: m.message,
    }));

    client.emit('receivePreviousMessages', messages);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: SendMessageDto,
  ): Promise<void> {
    const sender = client.data.user;
    console.log('Sender info:', sender);
    const room = client.data.room;

    if (!sender || !room) {
      this.logger.warn('Unauthorized or invalid message context.');
      client.emit('auth_error', { message: 'Unauthorized' });
      return;
    }

    const messagePayload = {
      senderId: sender.sub,
      name: sender.full_name,
      message: data.content,
    };

    // ✅ Immediately broadcast (optimistic update)
    this.server.to(room).emit('receiveMessage', messagePayload);

    // 🗄 Save asynchronously (don’t block broadcast)
    this.messagesService
      .create({ ...data, senderId: sender.sub }, room)
      .then(() => {
        this.logger.log(`Message saved for ${sender.email} in ${room}`);
      })
      .catch((err) => {
        this.logger.error('Failed to save message:', err);
      });

    this.logger.log(`Message broadcasted in ${room} by ${sender.email}`);
  }
}
