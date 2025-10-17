import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Appointments } from 'src/appointments/entities/appointment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('records')
export class Records {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique ID for the medical record' })
  id: string;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  @ApiProperty({ description: 'Patient user associated with the record' })
  patient: Users;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  @ApiProperty({ description: 'Doctor user who created the record' })
  doctor: Users;

  @ManyToOne(() => Appointments, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'appointment_id' })
  @ApiProperty({ description: 'Associated appointment (optional)' })
  appointment: Appointments;

  @Column()
  @ApiProperty({
    example: 'Follow-up Consultation',
    description: 'Record title',
  })
  title: string;

  @Column('text')
  @ApiProperty({
    example: 'The patient reported mild chest pain...',
    description: 'Details or notes',
  })
  description: string;

  @Column('text', { array: true })
  @ApiProperty({
    example: ['Paracetamol 500mg, twice a day'],
    description: 'List of prescriptions issued by the doctor',
    type: [String],
  })
  prescription: string[];

  @Column('text', { array: true, nullable: true })
  @ApiProperty({
    example: ['https://cdn.medichoice.ai/reports/lab1.pdf'],
    description: 'Optional attachments such as lab reports or scans',
    required: false,
    type: [String],
  })
  attachments?: string[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Created at timestamp' })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Updated at timestamp' })
  updated_at: Date;
}
