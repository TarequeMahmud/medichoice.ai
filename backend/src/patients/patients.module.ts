import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { DatabaseModule } from 'src/database/database.module';
import { patientProviders } from './patients.providers';
import { UsersModule } from 'src/users/users.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { RecordsModule } from 'src/records/records.module';

@Module({
  imports: [DatabaseModule, UsersModule, AppointmentsModule, RecordsModule],
  controllers: [PatientsController],
  providers: [...patientProviders, PatientsService],
})
export class PatientsModule {}
