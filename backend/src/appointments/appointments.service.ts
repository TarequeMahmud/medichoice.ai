import { Inject, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointments } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('APPOINTMENT_REPOSITORY')
    private patientRepository: Repository<Appointments>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointments> {
    const appointment = this.patientRepository.create(createAppointmentDto);
    return await this.patientRepository.save(appointment);
  }

  async findAll(): Promise<Appointments[]> {
    return await this.patientRepository.find();
  }

  async findOne(id: UUID): Promise<Appointments | null> {
    return await this.patientRepository.findOne({ where: { id } });
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return updateAppointmentDto;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
