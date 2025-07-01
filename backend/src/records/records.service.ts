import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { UUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Injectable()
export class RecordsService {
  constructor(
    @Inject('RECORD_REPOSITORY')
    private recordRepository: Repository<Record>,
    private userService: UsersService,
    private appointmentService: AppointmentsService,
  ) {}

  async create(doctorId: UUID, createRecordDto: CreateRecordDto) {
    const { patientId, appointmentId } = createRecordDto;

    const [patient, doctor, appointment] = await Promise.all([
      this.userService.findOne(patientId as UUID),
      this.userService.findOne(doctorId),
      this.appointmentService.findOne(appointmentId as UUID),
    ]);

    if (
      !doctor ||
      doctor.role !== 'doctor' ||
      !appointment ||
      appointment.doctor.id !== doctor.id
    ) {
      throw new ForbiddenException(
        'You are not authorized to create a record.',
      );
    }

    if (!appointment.admin_approved) {
      throw new ForbiddenException(
        'Cannot create medical record: appointment not approved.',
      );
    }

    if (appointment.status !== 'completed') {
      throw new ForbiddenException(
        'Appointment must be completed before creating the record.',
      );
    }

    if (!patient || appointment.patient.id !== patient.id) {
      throw new ForbiddenException('Patient mismatch in the appointment.');
    }

    const record = this.recordRepository.create({
      ...createRecordDto,
      doctor,
      patient,
      appointment,
    });

    return this.recordRepository.save(record);
  }

  findAll() {
    return `This action returns all records`;
  }

  findOne(id: UUID) {
    return `This action returns a #${id} record`;
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return updateRecordDto;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
