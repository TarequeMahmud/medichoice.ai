import {
  Column,
  Entity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/users/entities/user.entity';

@Entity('doctors')
export class Doctors {
  @PrimaryColumn('uuid')
  @ApiProperty({ description: 'Matches user.id of doctor', format: 'uuid' })
  id: string;

  @OneToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: Users;

  @Column('text', { array: true })
  @ApiProperty({
    example: ['Cardiology', 'Internal Medicine'],
    description: 'List of doctor specialties',
    type: [String],
  })
  specializations: string[];

  @Column('int')
  @ApiProperty({ example: 7, description: 'Years of experience' })
  experience_years: number;

  @Column('text')
  @ApiProperty({
    example: 'Experienced cardiologist at ABC Hospital.',
    description: 'Doctor biography',
  })
  bio: string;

  @Column()
  @ApiProperty({
    example: '123 Street Name, Dhaka',
    description: 'Clinic location',
  })
  clinic_address: string;

  @Column('text', { array: true })
  @ApiProperty({
    example: ['Sunday', 'Monday', 'Wednesday'],
    description: 'Available days of the week',
    type: [String],
  })
  available_days: string[];

  @Column()
  @ApiProperty({
    example: '09:00',
    description: 'Start time in HH:mm (24h format)',
  })
  available_time_start: string;

  @Column()
  @ApiProperty({
    example: 'Dr. John Doe',
    description: "Doctor's full name (copied from user.name)",
  })
  name: string;

  @Column()
  @ApiProperty({
    example: '17:00',
    description: 'End time in HH:mm (24h format)',
  })
  available_time_end: string;

  @Column('float', { default: 0 })
  @ApiProperty({
    example: 4.5,
    description: 'Average doctor rating (out of 5)',
  })
  rating: number;

  @Column({ default: false })
  @ApiProperty({
    example: true,
    description: 'Whether doctor is verified by admin',
  })
  is_verified: boolean;

  @CreateDateColumn()
  @ApiProperty({
    example: '2025-06-23T10:00:00Z',
    description: 'Record creation time',
  })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: '2025-06-23T10:00:00Z',
    description: 'Last updated time',
  })
  updated_at: Date;
}
