import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DatabaseModule } from 'src/database/database.module';
import { doctorProviders } from './doctors.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [DoctorsController],
  providers: [...doctorProviders, DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
