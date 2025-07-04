import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RequestWithUser } from 'src/common/types/auth';
import { UUID } from 'crypto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('records')
@ApiBearerAuth('access-token')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  create(
    @Body() createRecordDto: CreateRecordDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId as UUID;
    return this.recordsService.create(userId, createRecordDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.recordsService.findOne(id);
  }

  @Roles(UserRole.DOCTOR)
  @Patch(':id')
  update(
    @Param('id') id: UUID,
    @Body() updateRecordDto: UpdateRecordDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId as UUID;
    return this.recordsService.update(id, userId, updateRecordDto);
  }
  @Roles(UserRole.DOCTOR)
  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.recordsService.remove(id);
  }
}
