import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class Patients {
  @ApiProperty({
    example: 'b3c8e1e2-9f3e-4c1a-8b2e-1e2f3a4b5c6d',
    description: 'Patient ID, same as user ID (primary key and foreign key)',
  })
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: Users;

  @ApiProperty({ example: 'A+', description: 'Patient blood type' })
  @Column({ length: 3 })
  blood_type: string;

  @ApiProperty({
    example: '+880123456789',
    description: 'Emergency contact phone number',
  })
  @Column({ length: 20 })
  emergency_contact: string;

  @ApiProperty({
    example: '123 Main Street, Dhaka, Bangladesh',
    description: 'Residential address of the patient',
  })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth of the patient',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
    description: 'Gender of the patient',
    required: false,
  })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @ApiProperty({
    example: 170.5,
    description: 'Height in centimeters',
    required: false,
  })
  @Column({ type: 'float', nullable: true })
  height_cm: number;

  @ApiProperty({
    example: 65.2,
    description: 'Weight in kilograms',
    required: false,
  })
  @Column({ type: 'float', nullable: true })
  weight_kg: number;

  @ApiProperty({
    example: ['Penicillin', 'Peanuts'],
    description: 'Known allergies',
    required: false,
  })
  @Column({ type: 'text', array: true, nullable: true })
  known_allergies: string[];

  @ApiProperty({
    example: ['Diabetes', 'Hypertension'],
    description: 'Chronic health conditions',
    required: false,
  })
  @Column({ type: 'text', array: true, nullable: true })
  chronic_conditions: string[];

  @ApiProperty({
    example: ['Metformin', 'Amlodipine'],
    description: 'Current medications the patient is taking',
    required: false,
  })
  @Column({ type: 'text', array: true, nullable: true })
  medications: string[];

  @ApiProperty({
    example:
      'Patient had a surgery in 2019 and has a history of high blood pressure.',
    description: 'Brief medical history summary',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  medical_history: string;

  @ApiProperty({
    example: 'MediCare Health',
    description: 'Insurance provider name',
    required: false,
  })
  @Column({ nullable: true })
  insurance_provider: string;

  @ApiProperty({
    example: 'MC1234567890',
    description: 'Insurance policy number',
    required: false,
  })
  @Column({ nullable: true })
  insurance_number: string;

  @ApiProperty({
    example: 'Jane Doe',
    description: 'Emergency contact person’s name',
    required: false,
  })
  @Column({ nullable: true })
  emergency_contact_name: string;

  @ApiProperty({
    example: 'Mother',
    description: 'Relationship of emergency contact to the patient',
    required: false,
  })
  @Column({ nullable: true })
  emergency_contact_relation: string;
}
