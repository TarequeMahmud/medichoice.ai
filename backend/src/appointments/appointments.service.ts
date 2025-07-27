import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointments, AppointmentStatus } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { UserRole } from 'src/users/entities/user.entity';

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
  ): Promise<AppointmentResponseDto | null> {
    const doctorId = createAppointmentDto.doctorId as UUID;
    const [patient, doctor] = await Promise.all([
      this.userService.findOne(patientId),
      this.userService.findOne(doctorId),
    ]);
    const doctorRole: UserRole = doctor.role;

    if (!patient) throw new NotFoundException('Invalid patient');
    if (!doctor || doctorRole !== UserRole.DOCTOR)
      throw new NotFoundException('Invalid doctor id');

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      patient,
      doctor,
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);
    return await this.findAppointments({ id: savedAppointment.id }, false);
  }

  async findAll(): Promise<AppointmentResponseDto[]> {
    return await this.findAppointments({}, true);
  }

  async findOne(id: UUID): Promise<AppointmentResponseDto | null> {
    return await this.findAppointments({ id }, false);
  }

  async findAllByDoctorId(doctorId: UUID): Promise<AppointmentResponseDto[]> {
    return await this.findAppointments({ doctor: { id: doctorId } }, true);
  }

  async findAllByPatientId(patientId: UUID): Promise<AppointmentResponseDto[]> {
    return await this.findAppointments({ patient: { id: patientId } }, true);
  }

  async update(
    id: UUID,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto | null> {
    await this.appointmentRepository.update(id, updateAppointmentDto);
    return await this.findAppointments({ id }, false);
  }

  async changeStatus(id: UUID, status: AppointmentStatus): Promise<void> {
    const updateStatusDto: UpdateAppointmentDto = { status };
    if (status === AppointmentStatus.APPROVED) {
      updateStatusDto.admin_approved = true;
    }
    if (status === AppointmentStatus.DECLINED) {
      updateStatusDto.admin_approved = false;
    }

    if (status === AppointmentStatus.COMPLETED) {
      const appointment = await this.findOne(id);
      if (appointment && !appointment.admin_approved) {
        throw new BadRequestException(
          'Cannot complete appointment: it is not approved by admin yet.',
        );
      }
    }
    await this.update(id, updateStatusDto);
  }

  async remove(id: UUID): Promise<void> {
    await this.appointmentRepository.delete(id);
  }

  private async findAppointments<T extends boolean>(
    condition: object,
    multiple: T,
  ): Promise<
    T extends true ? AppointmentResponseDto[] : AppointmentResponseDto | null
  > {
    const findOptions = {
      where: condition,
      relations: ['doctor', 'patient'],
    };
    if (multiple) {
      const results = await this.appointmentRepository.find(findOptions);
      const appointments = plainToInstance(
        AppointmentResponseDto,
        results || [],
        {
          excludeExtraneousValues: true,
        },
      );
      return appointments as T extends true ? AppointmentResponseDto[] : never;
    } else {
      const result = await this.appointmentRepository.findOne(findOptions);
      if (!result) return null as T extends true ? never : null;
      const appointment = plainToInstance(AppointmentResponseDto, result, {
        excludeExtraneousValues: true,
      });
      return appointment as T extends true ? never : AppointmentResponseDto;
    }
  }
}
