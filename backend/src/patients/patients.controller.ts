import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UUID } from 'crypto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }
}
