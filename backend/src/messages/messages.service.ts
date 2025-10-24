import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Messages } from './entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { UsersService } from 'src/users/users.service';
import { UUID } from 'crypto';
import { DoctorChat } from 'src/common/types/auth';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private messageRepository: Repository<Messages>,
    private userService: UsersService,
  ) { }

  async create(
    sendMessageDto: SendMessageDto,
    room: string,
  ): Promise<Messages> {
    const { senderId, receiverId, content } = sendMessageDto;

    const [sender, receiver] = await Promise.all([
      this.userService.findOne(senderId as UUID),
      this.userService.findOne(receiverId as UUID),
    ]);

    const message = this.messageRepository.create({
      sender,
      receiver,
      message: content,
      room,
    });

    return this.messageRepository.save(message);
  }

  async findByRoom(room: string): Promise<Messages[]> {
    return this.messageRepository.find({
      where: { room },
      relations: ['sender', 'receiver'],
      order: { sent_at: 'ASC' },
    });
  }



  async findAllChatsByDoctor(doctorId: string): Promise<DoctorChat[]> {
    // Fetch raw results from DB
    const rawChats: {
      room: string;
      lastmessageat: string; // Postgres returns string from MAX(timestamp)
      senderid: string;
      sendername: string;
      receiverid: string;
      receivername: string;
    }[] = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .leftJoin('message.receiver', 'receiver')
      .where('message.room LIKE :roomPrefix', {
        roomPrefix: `room-${doctorId}-%`,
      })
      .groupBy('message.room')
      .addGroupBy('sender.id')
      .addGroupBy('receiver.id')
      .orderBy('MAX(message.sent_at)', 'DESC')
      .select([
        'message.room AS room',
        'MAX(message.sent_at) AS lastmessageat',
        'sender.id AS senderid',
        'sender.full_name AS sendername',
        'receiver.id AS receiverid',
        'receiver.full_name AS receivername',
      ])
      .getRawMany();

    // Map to proper camelCase and convert date
    const chats: DoctorChat[] = rawChats.map((chat) => ({
      room: chat.room,
      lastMessageAt: new Date(chat.lastmessageat),
      senderId: chat.senderid,
      senderName: chat.sendername,
      receiverId: chat.receiverid,
      receiverName: chat.receivername,
    }));

    return chats;
  }

}
