import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { DatabaseModule } from 'src/database/database.module';
import { appointmentProviders } from './appointments.providers';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [AppointmentsController],
  providers: [...appointmentProviders, AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
