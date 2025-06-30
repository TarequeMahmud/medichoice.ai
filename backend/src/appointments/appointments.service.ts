import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointments, AppointmentStatus } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('APPOINTMENT_REPOSITORY')
    private appointmentRepository: Repository<Appointments>,
    private userService: UsersService,
  ) {}

  async create(
    patientId: UUID,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointments> {
    const doctorId = createAppointmentDto.doctorId as UUID;
    const patient = await this.userService.findOne(patientId);
    const doctor = await this.userService.findOne(doctorId);

    if (!patient) throw new NotFoundException('Invalid patient');
    if (!doctor || doctor.role !== 'doctor')
      throw new NotFoundException('Invalid doctor id');

    const newAppointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      patient,
      doctor,
    });

    const appointment = this.appointmentRepository.create(newAppointment);
    return await this.appointmentRepository.save(appointment);
  }

  async findAll(): Promise<Appointments[]> {
    return await this.appointmentRepository.find({
      relations: ['doctor', 'patient'],
    });
  }

  async findOne(id: UUID): Promise<Appointments | null> {
    return await this.appointmentRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });
  }

  async update(
    id: UUID,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointments | null> {
    await this.appointmentRepository.update(id, updateAppointmentDto);
    return await this.appointmentRepository.findOne({ where: { id } });
  }

  async changeStatus(id: UUID, status: AppointmentStatus): Promise<void> {
    let updateStatusDto: UpdateAppointmentDto = { status };
    if (status === AppointmentStatus.APPROVED) {
      updateStatusDto.admin_approved = true;
    }
    if (status === AppointmentStatus.DECLINED) {
      updateStatusDto.admin_approved = false;
    }
    await this.update(id, updateStatusDto);
  }

  async remove(id: UUID): Promise<void> {
    await this.appointmentRepository.delete(id);
  }
}
