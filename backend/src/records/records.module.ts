import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { recordProviders } from './records.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';

@Module({
  imports: [DatabaseModule, UsersModule, AppointmentsModule],
  controllers: [RecordsController],
  providers: [...recordProviders, RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}
