import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Doctor user ID', format: 'uuid' })
  doctorId: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-06-30T14:00:00Z',
    description: 'Scheduled time of appointment',
  })
  scheduled_time: Date;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  @ApiProperty({
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING,
    description: 'Appointment status',
    required: false,
  })
  status?: AppointmentStatus;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: false,
    description: 'Whether admin has approved the appointment',
    required: false,
  })
  admin_approved?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'General check-up',
    description: 'Reason for appointment',
    required: false,
  })
  reason?: string;
}
