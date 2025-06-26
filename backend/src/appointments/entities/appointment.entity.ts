import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum AppointmentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  COMPLETED = 'completed',
}

@Entity('appointments')
export class Appointments {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique appointment ID', format: 'uuid' })
  id: string;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  @ApiProperty({ description: 'Patient user', type: () => Users })
  patient: Users;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  @ApiProperty({ description: 'Doctor user', type: () => Users })
  doctor: Users;

  @Column('timestamp')
  @ApiProperty({
    example: '2025-06-30T14:00:00Z',
    description: 'Scheduled time of appointment',
  })
  scheduled_time: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  @ApiProperty({
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING,
    description: 'Appointment status',
  })
  status: AppointmentStatus;

  @Column({ default: false })
  @ApiProperty({
    example: false,
    description: 'Whether admin has approved the appointment',
  })
  admin_approved: boolean;

  @Column('text', { nullable: true })
  @ApiProperty({
    example: 'General check-up',
    description: 'Reason for appointment',
  })
  reason: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Created at timestamp' })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Updated at timestamp' })
  updated_at: Date;
}
