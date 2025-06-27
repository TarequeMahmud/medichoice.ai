import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { DatabaseModule } from 'src/database/database.module';
import { patientProviders } from './patients.providers';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [PatientsController],
  providers: [...patientProviders, PatientsService],
})
export class PatientsModule {}
