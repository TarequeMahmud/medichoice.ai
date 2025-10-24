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
import { MessagesService } from 'src/messages/messages.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UUID } from 'crypto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RequestWithUser } from 'src/common/types/auth';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly messagesService: MessagesService,
  ) {}

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

  @Roles(UserRole.DOCTOR)
  @Get('me/records')
  findAllRecords(@Req() req: RequestWithUser) {
    const doctorId = req.user.userId;
    return this.doctorsService.findAllRecordsByDoctorId(doctorId);
  }

  @Roles(UserRole.DOCTOR)
  @Get('me/chats')
  @ApiOperation({ summary: 'Get all chat rooms for the logged-in doctor' })
  async getMyChats(@Req() req: RequestWithUser) {
    const doctorId = req.user.userId;
    return this.messagesService.findAllChatsByDoctor(doctorId);
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
