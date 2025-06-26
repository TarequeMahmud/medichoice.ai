import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';

@Module({
  controllers: [TipsController],
  providers: [TipsService],
})
export class TipsModule {}
