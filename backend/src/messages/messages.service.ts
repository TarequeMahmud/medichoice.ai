import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Messages } from './entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { UsersService } from 'src/users/users.service';
import { UUID } from 'crypto';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private messageRepository: Repository<Messages>,
    private userService: UsersService,
  ) {}

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
    });
  }
}
