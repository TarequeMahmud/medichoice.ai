import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Repository } from 'typeorm';
import { Records } from './entities/record.entity';
import { UUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { UserRole } from 'src/users/entities/user.entity';
import { AppointmentResponseDto } from 'src/appointments/dto/appointment-response.dto';

@Injectable()
export class RecordsService {
  constructor(
    @Inject('RECORD_REPOSITORY')
    private recordRepository: Repository<Records>,
    private userService: UsersService,
    private appointmentService: AppointmentsService,
  ) { }

  async create(doctorId: UUID, createRecordDto: CreateRecordDto) {
    const { patientId, appointmentId } = createRecordDto;

    if (!appointmentId) {
      throw new ForbiddenException('Appointment ID is required to create a record.');
    }

    const [patient, doctor, appointment] = await Promise.all([
      this.userService.findOne(patientId as UUID),
      this.userService.findOne(doctorId),
      this.appointmentService.getFullAppointment(appointmentId as UUID),
    ]);
    console.log(appointment);

    if (!doctor || doctor.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('You are not authorized to create a record.');
    }

    if (!appointment) {
      throw new ForbiddenException('Appointment not found.');
    }

    if (appointment.doctor.id !== doctor.id) {
      throw new ForbiddenException('You are not the doctor of this appointment.');
    }

    if (!appointment.admin_approved) {
      throw new ForbiddenException('Appointment not approved by admin.');
    }

    if (appointment.status !== 'completed') {
      throw new ForbiddenException(
        'Appointment must be completed before creating a record.',
      );
    }

    if (!patient || appointment.patient.id !== patient.id) {
      throw new ForbiddenException('Patient mismatch in the appointment.');
    }

    const record = this.recordRepository.create({
      title: createRecordDto.title,
      description: createRecordDto.description,
      prescription: createRecordDto.prescription,
      attachments: createRecordDto.attachments ?? [],
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

  async findAllByPatientId(patientId: UUID): Promise<Records[]> {
    return this.recordRepository.find({
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
      throw new NotFoundException(`Record with id ${id} not found.`);
    }
    return record;
  }

  async update(id: UUID, doctorId: UUID, updateRecordDto: UpdateRecordDto): Promise<Records> {
    const [doctor, record] = await Promise.all([
      this.userService.findOne(doctorId),
      this.recordRepository.findOne({ where: { id }, relations: ['doctor'] }),
    ]);

    if (!record) {
      throw new NotFoundException(`Record with id ${id} not found.`);
    }

    if (!doctor || doctor.role !== UserRole.DOCTOR || doctor.id !== record.doctor.id) {
      throw new ForbiddenException('You are not authorized to update this record.');
    }

    Object.assign(record, updateRecordDto);
    return this.recordRepository.save(record);
  }

  async remove(id: UUID) {
    const record = await this.recordRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Record with id ${id} not found.`);
    }
    await this.recordRepository.remove(record);
    return { message: `Record with id ${id} removed.` };
  }
}
