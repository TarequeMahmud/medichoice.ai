import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Repository } from 'typeorm';
import { Doctors } from './entities/doctor.entity';
import { UUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { RecordsService } from 'src/records/records.service';

@Injectable()
export class DoctorsService {
  constructor(
    @Inject('DOCTOR_REPOSITORY')
    private doctorRepository: Repository<Doctors>,
    private userService: UsersService,
    private appointmentService: AppointmentsService,
    private readonly recordService: RecordsService,
  ) { }

  async create(
    userId: UUID,
    createDoctorDto: CreateDoctorDto,
  ): Promise<Doctors> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isExists = await this.findOne(userId);
    if (isExists) {
      throw new ConflictException('Doctor profile already exists');
    }
    const doctorName = createDoctorDto.name || user.full_name;
    if (!doctorName) {
      throw new ConflictException('Doctor name is required');
    }

    const newDoctorProfile = this.doctorRepository.create({
      ...createDoctorDto,
      id: userId,
      name: doctorName,
    });
    await this.doctorRepository.save(newDoctorProfile);
    return newDoctorProfile;
  }

  async findAll(): Promise<Doctors[]> {
    return await this.doctorRepository.find();
  }

  async findOne(id: UUID): Promise<Doctors | null> {
    return await this.doctorRepository.findOne({ where: { id } });
  }

  async findAllAppointmentsByUserId(userId: UUID) {
    console.log(userId);

    const doctor = await this.findOne(userId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return this.appointmentService.findAllByDoctorId(userId);
  }

  findAllRecordsByDoctorId(doctorId: UUID) {
    return this.recordService.findAllByDoctorId(doctorId);
  }

  async update(
    id: UUID,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctors | null> {
    const doctor = await this.findOne(id);
    if (!doctor) {
      return null;
    }
    Object.assign(doctor, updateDoctorDto);
    const updatedDoctor = await this.doctorRepository.save(doctor);
    return updatedDoctor;
  }

  async remove(id: UUID): Promise<boolean> {
    const result = await this.doctorRepository.delete(id);
    return typeof result.affected === 'number' && result.affected > 0;
  }
}
