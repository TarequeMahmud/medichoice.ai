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
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');

  constructor(
    private readonly messagesService: MessagesService,
    private jwtService: JwtService,
  ) {}

  afterInit() {
    this.logger.log('message socket initialised');
  }

  handleConnection(client: AuthenticatedSocket) {
    const token: string = client.handshake.auth.token as string;

    if (!token) {
      client.disconnect();
      console.warn('Connection rejected: No token provided');
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      if (![UserRole.DOCTOR, UserRole.PATIENT].includes(payload.role)) {
        client.emit('auth error:', { message: 'Forbidden role' });
        client.disconnect(true);
        this.logger.warn(`Connection rejected: Invalid role ${payload.role}`);
        return;
      }
      client.data.user = payload;
      console.log(payload);
    } catch (error: unknown) {
      client.disconnect();
      console.warn('Connection rejected: Invalid token:', error);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.data.user.email}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { receiverId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    let room: string;
    const sender = client.data.user;
    console.log('the reciever is: ', data.receiverId);
    const senderRole: UserRole = sender.role;

    if (senderRole === UserRole.DOCTOR) {
      room = `room-${sender.sub}-${data.receiverId}`;
    } else {
      room = `room-${data.receiverId}-${sender.sub}`;
    }

    await client.join(room);
    client.data.room = room;
    this.logger.log('joined room: ', room);
    const getPreviousMessage = await this.messagesService.findByRoom(room);

    const messages = getPreviousMessage.map((message) => ({
      name: message.sender.full_name,
      message: message.message,
    }));

    for (const msg of messages) {
      client.emit('receiveMessage', msg);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: SendMessageDto,
  ): Promise<void> {
    const room = client.data.room;
    console.log('room is:', room);
    const messageData = await this.messagesService.create(data, room);

    const message = {
      name: messageData.sender.full_name,
      message: messageData.message,
    };
    console.log(message);
    this.server.to(room).emit('receiveMessage', message);
    this.logger.log(data);
  }
}
