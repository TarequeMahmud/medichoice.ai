import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Repository } from 'typeorm';
import { Record, Records } from './entities/record.entity';
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

  async findAll() {
    return this.recordRepository.find({
      relations: ['doctor', 'patient', 'appointment'],
    });
  }

  async findAllByPatientId(patientId: UUID): Promise<Record[]> {
    return await this.recordRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor', 'patient', 'appointment'],
    });
  }

  async findOne(id: UUID) {
    const record = await this.recordRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient', 'appointment'],
    });
    if (!record) {
      throw new ForbiddenException(`Record with id ${id} not found.`);
    }
    return record;
  }

  async update(
    id: UUID,
    doctorId: UUID,
    updateRecordDto: UpdateRecordDto,
  ): Promise<Record> {
    const [doctor, record] = await Promise.all([
      this.userService.findOne(doctorId),
      this.recordRepository.findOne({ where: { id }, relations: ['doctor'] }),
    ]);

    if (!doctor || doctor.role !== 'doctor') {
      throw new ForbiddenException(
        'You are not authorized to update this record.',
      );
    }
    if (!record) {
      throw new ForbiddenException(`Record with id ${id} not found.`);
    }

    Object.assign(record, updateRecordDto);
    return this.recordRepository.save(record);
  }

  async remove(id: UUID) {
    const record = await this.recordRepository.findOne({ where: { id } });
    if (!record) {
      throw new ForbiddenException(`Record with id ${id} not found.`);
    }
    await this.recordRepository.remove(record);
    return { message: `Record with id ${id} removed.` };
  }
}
