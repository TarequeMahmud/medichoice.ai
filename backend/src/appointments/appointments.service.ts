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
    private appointmentRepository: Repository<Appointments>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointments> {
    const appointment = this.appointmentRepository.create(createAppointmentDto);
    return await this.appointmentRepository.save(appointment);
  }

  async findAll(): Promise<Appointments[]> {
    return await this.appointmentRepository.find();
  }

  async findOne(id: UUID): Promise<Appointments | null> {
    return await this.appointmentRepository.findOne({ where: { id } });
  }

  async update(
    id: UUID,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointments | null> {
    await this.appointmentRepository.update(id, updateAppointmentDto);
    return await this.appointmentRepository.findOne({ where: { id } });
  }

  async remove(id: UUID): Promise<void> {
    await this.appointmentRepository.delete(id);
  }
}
