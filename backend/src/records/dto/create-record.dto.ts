import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateRecordDto {
  @ApiProperty({ description: 'Patient user ID associated with the record' })
  @IsString()
  patientId: string;

  @ApiPropertyOptional({ description: 'Associated appointment ID (optional)' })
  @IsOptional()
  @IsString()
  appointmentId?: string;

  @ApiProperty({
    example: 'Follow-up Consultation',
    description: 'Record title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'The patient reported mild chest pain...',
    description: 'Details or notes',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Paracetamol 500mg, twice a day',
    description: 'Prescription issued by the doctor',
  })
  @IsString()
  prescription: string;

  @ApiPropertyOptional({
    example: ['https://cdn.medichoice.ai/reports/lab1.pdf'],
    description: 'Optional attachments such as lab reports or scans',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
