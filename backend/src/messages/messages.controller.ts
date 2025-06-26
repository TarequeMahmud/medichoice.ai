import { Controller, Get } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Get(':id')
  findOne(id: string) {
    return this.messagesService.findOne(+id);
  }
}
