import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../entities/patient.entity';

export class CreatePatientDto {
  @ApiProperty({ example: 'A+', description: 'Patient blood type' })
  @IsString()
  @MaxLength(3)
  blood_type: string;

  @ApiProperty({
    example: '+880123456789',
    description: 'Emergency contact phone number',
  })
  @IsString()
  @MaxLength(20)
  @MinLength(11)
  emergency_contact: string;

  @ApiProperty({
    example: '123 Main Street, Dhaka, Bangladesh',
    description: 'Residential address of the patient',
  })
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Date of birth of the patient',
  })
  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @ApiPropertyOptional({
    enum: Gender,
    example: Gender.MALE,
    description: 'Gender of the patient',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    example: 170.5,
    description: 'Height in centimeters',
  })
  @IsOptional()
  @IsNumber()
  height_cm?: number;

  @ApiPropertyOptional({
    example: 65.2,
    description: 'Weight in kilograms',
  })
  @IsOptional()
  @IsNumber()
  weight_kg?: number;

  @ApiPropertyOptional({
    example: ['Penicillin', 'Peanuts'],
    description: 'Known allergies',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  known_allergies?: string[];

  @ApiPropertyOptional({
    example: ['Diabetes', 'Hypertension'],
    description: 'Chronic health conditions',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chronic_conditions?: string[];

  @ApiPropertyOptional({
    example: ['Metformin', 'Amlodipine'],
    description: 'Current medications the patient is taking',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications?: string[];

  @ApiPropertyOptional({
    example:
      'Patient had a surgery in 2019 and has a history of high blood pressure.',
    description: 'Brief medical history summary',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  medical_history?: string;

  @ApiPropertyOptional({
    example: 'MediCare Health',
    description: 'Insurance provider name',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  insurance_provider?: string;

  @ApiPropertyOptional({
    example: 'MC1234567890',
    description: 'Insurance policy number',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  insurance_number?: string;

  @ApiPropertyOptional({
    example: 'Jane Doe',
    description: 'Emergency contact person’s name',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  emergency_contact_name?: string;

  @ApiPropertyOptional({
    example: 'Mother',
    description: 'Relationship of emergency contact to the patient',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  emergency_contact_relation?: string;
}
