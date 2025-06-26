import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { DatabaseModule } from 'src/database/database.module';
import { appointmentProviders } from './appointments.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AppointmentsController],
  providers: [...appointmentProviders, AppointmentsService],
})
export class AppointmentsModule {}
