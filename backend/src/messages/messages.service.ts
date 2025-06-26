import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }
}
