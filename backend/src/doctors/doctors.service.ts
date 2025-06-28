import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Repository } from 'typeorm';
import { Doctors } from './entities/doctor.entity';
import { UUID } from 'crypto';

@Injectable()
export class DoctorsService {
  constructor(private doctorRepository: Repository<Doctors>) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctors> {
    const doctor = this.doctorRepository.create(createDoctorDto);
    return await this.doctorRepository.save(doctor);
  }

  async findAll(): Promise<Doctors[]> {
    return await this.doctorRepository.find();
  }

  async findOne(id: UUID): Promise<Doctors | null> {
    return await this.doctorRepository.findOne({ where: { id } });
  }

  async update(
    id: UUID,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctors | null> {
    await this.doctorRepository.update(id, updateDoctorDto);
    return await this.doctorRepository.findOne({ where: { id } });
  }

  async remove(id: UUID): Promise<void> {
    await this.doctorRepository.delete(id);
  }
}
