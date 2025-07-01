import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { UUID } from 'crypto';
import { RequestWithUser } from 'src/common/types/auth';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post()
  create(@Body() createTipDto: CreateTipDto, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.tipsService.create(userId, createTipDto);
  }

  @Get()
  findAll() {
    return this.tipsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.tipsService.findOne(id);
  }

  @Get('random')
  getRandomTip() {
    return this.tipsService.getRandom();
  }

  @Patch(':id')
  update(
    @Param('id') id: UUID,
    @Body() updateTipDto: UpdateTipDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.tipsService.update(id, userId, updateTipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.tipsService.remove(id);
  }
}
