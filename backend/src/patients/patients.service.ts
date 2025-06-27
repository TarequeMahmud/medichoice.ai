import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  create(createPatientDto: CreatePatientDto) {
    return createPatientDto;
  }

  findAll() {
    return `This action returns all patients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return updatePatientDto;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
