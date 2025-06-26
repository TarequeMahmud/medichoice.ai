import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AiModule } from './ai/ai.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DoctorsModule } from './doctors/doctors.module';
import { RecordsModule } from './records/records.module';
import { MessagesModule } from './messages/messages.module';
import { TipsModule } from './tips/tips.module';


@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AiModule,
    PatientsModule,
    AppointmentsModule,
    DoctorsModule,
    RecordsModule,
    MessagesModule,
    TipsModule,

  ],
})
export class AppModule {}
