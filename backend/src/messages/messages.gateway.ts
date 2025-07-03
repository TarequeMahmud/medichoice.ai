import { Logger, UnauthorizedException } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtService } from '@nestjs/jwt';

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

  afterInit(server: Server) {
    this.logger.log('message socket initialised');
  }

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    if (!token) {
      client.disconnect();
      throw new UnauthorizedException('You are unauthorized');
    }

    try {
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      console.log(payload);
    } catch (error) {
      client.disconnect();
      throw new UnauthorizedException('Invalid token');
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { recieverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    let room: string;
    const sender = client.data.user;
    if (sender.role === 'doctor') {
      room = `room-${sender.sub}-${data.recieverId}`;
    } else {
      room = `room-${data.recieverId}-${sender.sub}`;
    }

    client.join(room);
    client.data.room = room;
    this.logger.log('joined room', { room });
    client.emit('joined room', { room });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
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
    this.logger.log(`Message from ${data.senderId}: ${data.content}`);
  }
}
