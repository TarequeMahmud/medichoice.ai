import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';
import { tipProviders } from './tips.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TipsController],
  providers: [...tipProviders, TipsService],
})
export class TipsModule {}
