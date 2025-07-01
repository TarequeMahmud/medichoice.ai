import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Repository } from 'typeorm';
import { Patients } from './entities/patient.entity';
import { UUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { RecordsService } from 'src/records/records.service';

@Injectable()
export class PatientsService {
  constructor(
    @Inject('PATIENT_REPOSITORY')
    private patientRepository: Repository<Patients>,
    private userService: UsersService,
    private readonly appointmentService: AppointmentsService,
    private readonly recordService: RecordsService,
  ) {}
  async create(
    userId: UUID,
    createPatientDto: CreatePatientDto,
  ): Promise<Patients> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isExists = await this.findOne(userId);
    if (isExists) {
      throw new ConflictException('Patient profile already exists');
    }

    const newPatientProfile = this.patientRepository.create({
      ...createPatientDto,
      id: userId,
    });
    await this.patientRepository.save(newPatientProfile);
    return newPatientProfile;
  }

  async findOne(id: UUID): Promise<Patients | null> {
    return await this.patientRepository.findOne({ where: { id } });
  }

  async getAppointmentsByUserId(userId: UUID) {
    const patient = await this.userService.findOne(userId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return await this.appointmentService
      .findAllByPatientId(userId)
      .then((res) => res || []);
  }

  async getRecordsByUserId(userId: UUID) {
    const patient = await this.userService.findOne(userId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return await this.recordService
      .findAllByPatientId(userId)
      .then((res) => res || []);
  }

  async update(
    id: UUID,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patients | null> {
    try {
      const patient = await this.findOne(id);
      if (!patient) {
        return null;
      }
      Object.assign(patient, updatePatientDto);
      const updatedPatient = await this.patientRepository.save(patient);
      return updatedPatient;
    } catch (error: unknown) {
      throw error;
    }
  }

  async remove(id: UUID): Promise<boolean> {
    const result = await this.patientRepository.delete(id);
    return typeof result.affected === 'number' && result.affected > 0;
  }
}
