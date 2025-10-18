import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UUID } from 'crypto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RequestWithUser } from 'src/common/types/auth';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  @Roles(UserRole.DOCTOR)
  @Post()
  create(
    @Body() createDoctorDto: CreateDoctorDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.doctorsService.create(userId, createDoctorDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PATIENT)
  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @Roles(UserRole.DOCTOR)
  @Get('me/appointments')
  findAllAppointments(@Req() req: RequestWithUser) {
    const doctorId = req.user.userId;
    return this.doctorsService.findAllAppointmentsByUserId(doctorId);
  }

  @Get('me/records')
  @Roles(UserRole.DOCTOR)
  findAllRecords(@Req() req: RequestWithUser) {
    const doctorId = req.user.userId;
    return this.doctorsService.findAllRecordsByDoctorId(doctorId);
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.doctorsService.findOne(id);
  }



  @Roles(UserRole.DOCTOR)
  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }
}
