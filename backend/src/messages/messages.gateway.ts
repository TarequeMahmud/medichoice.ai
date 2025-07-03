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
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway()
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');

  constructor(private readonly messagesService: MessagesService) {}

  afterInit(server: Server) {
    this.logger.log('message socket initialised');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { doctorId: string; patientId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `room-${data.doctorId}-${data.patientId}`;
    client.join(room);
    this.logger.log('joined room', { room });
    client.emit('joined room', { room });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: SendMessageDto,
  ): Promise<void> {
    const room = `room-${data.receiverId}-${data.senderId}`;
    console.log('room is:', room);
    const messageData = await this.messagesService.create(data);

    const message = {
      name: messageData.sender.full_name,
      message: messageData.message,
    };
    console.log(message);
    this.server.to(room).emit('receiveMessage', message);
    this.logger.log(`Message from ${data.senderId}: ${data.content}`);
  }
}
