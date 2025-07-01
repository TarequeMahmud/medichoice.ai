import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UUID } from 'crypto';
import { RequestWithUser } from 'src/common/types/auth';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(UserRole.PATIENT)
  create(
    @Body() createPatientDto: CreatePatientDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    console.log('user id: ', userId);
    return this.patientsService.create(userId, createPatientDto);
  }

  @Roles(UserRole.PATIENT)
  @Get('me/appointments')
  getMyAppointments(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.patientsService.getAppointmentsByUserId(userId);
  }

  @Roles(UserRole.PATIENT)
  @Get('me/records')
  getMyRecords(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.patientsService.getRecordsByUserId(userId);
  }

  @Roles(UserRole.PATIENT, UserRole.ADMIN, UserRole.DOCTOR)
  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.patientsService.findOne(id);
  }

  @Roles(UserRole.PATIENT)
  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }
}
