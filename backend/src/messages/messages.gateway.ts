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

@WebSocketGateway()
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');

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
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { senderId: string; receiverId: string; content: string },
  ): void {
    const room = `room-${data.receiverId}-${data.senderId}`;
    console.log('room is:', room);
    this.server.to(room).emit('receiveMessage', data);
    this.logger.log(`Message from ${data.senderId}: ${data.content}`);
  }
}
