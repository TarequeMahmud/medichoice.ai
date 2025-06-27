import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { recordProviders } from './records.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RecordsController],
  providers: [...recordProviders, RecordsService],
})
export class RecordsModule {}
