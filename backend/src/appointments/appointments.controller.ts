import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UUID } from 'crypto';
import { RequestWithUser } from 'src/common/types/auth';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentStatus } from './entities/appointment.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.PATIENT)
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.appointmentsService.create(userId, createAppointmentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
  findOne(@Param('id') id: UUID) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.PATIENT)
  update(
    @Param('id') id: UUID,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN)
  approve(@Param('id') id: UUID) {
    return this.appointmentsService.changeStatus(
      id,
      AppointmentStatus.APPROVED,
    );
  }

  @Patch(':id/decline')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  decline(@Param('id') id: UUID) {
    return this.appointmentsService.changeStatus(
      id,
      AppointmentStatus.DECLINED,
    );
  }

  @Patch(':id/complete')
  @Roles(UserRole.PATIENT, UserRole.DOCTOR)
  complete(@Param('id') id: UUID) {
    return this.appointmentsService.changeStatus(
      id,
      AppointmentStatus.COMPLETED,
    );
  }

  @Delete(':id')
  @Roles(UserRole.PATIENT, UserRole.ADMIN)
  remove(@Param('id') id: UUID) {
    return this.appointmentsService.remove(id);
  }
}
