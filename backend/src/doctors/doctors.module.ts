import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DatabaseModule } from 'src/database/database.module';
import { doctorProviders } from './doctors.providers';
import { UsersModule } from 'src/users/users.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';

@Module({
  imports: [DatabaseModule, UsersModule, AppointmentsModule],
  controllers: [DoctorsController],
  providers: [...doctorProviders, DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
