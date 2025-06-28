import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsInt,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayMinSize,
  IsUUID,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  Matches,
} from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({
    example: ['Cardiology', 'Internal Medicine'],
    description: 'List of doctor specialties',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  specializations: string[];

  @ApiProperty({ example: 7, description: 'Years of experience' })
  @IsInt()
  @Min(0)
  experience_years: number;

  @ApiProperty({
    example: 'Experienced cardiologist at ABC Hospital.',
    description: 'Doctor biography',
  })
  @IsString()
  @IsNotEmpty()
  bio: string;

  @ApiProperty({
    example: '123 Street Name, Dhaka',
    description: 'Clinic location',
  })
  @IsString()
  @IsNotEmpty()
  clinic_address: string;

  @ApiProperty({
    example: ['Sunday', 'Monday', 'Wednesday'],
    description: 'Available days of the week',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  available_days: string[];

  @ApiProperty({
    example: '09:00',
    description: 'Start time in HH:mm (24h format)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'available_time_start must be in HH:mm 24h format',
  })
  available_time_start: string;

  @ApiProperty({
    example: '17:00',
    description: 'End time in HH:mm (24h format)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'available_time_end must be in HH:mm 24h format',
  })
  available_time_end: string;

  @ApiProperty({
    example: 4.5,
    description: 'Average doctor rating (out of 5)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiProperty({
    example: true,
    description: 'Whether doctor is verified by admin',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}
