import { Injectable } from '@nestjs/common';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';

@Injectable()
export class TipsService {
  create(createTipDto: CreateTipDto) {
    return createTipDto;
  }

  findAll() {
    return `This action returns all tips`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tip`;
  }

  update(id: number, updateTipDto: UpdateTipDto) {
    return updateTipDto;
  }

  remove(id: number) {
    return `This action removes a #${id} tip`;
  }
}
