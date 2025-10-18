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
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RecordResponseDto } from './dto/record-response.dto';
import { plainToInstance } from 'class-transformer';
import { UUID } from 'crypto';

@ApiTags('Records')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  // CREATE RECORD
  @Post()
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Create a new medical record (Doctor only)' })
  @ApiResponse({ status: 201, type: RecordResponseDto })
  async create(
    @Body() createRecordDto: CreateRecordDto,
    @Req() req: RequestWithUser,
  ): Promise<RecordResponseDto> {
    const userId = req.user.userId;
    const record = await this.recordsService.create(userId, createRecordDto);
    return plainToInstance(RecordResponseDto, record, {
      excludeExtraneousValues: true,
    });
  }

  // FIND ALL RECORDS
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Retrieve all medical records (Admin only)' })
  @ApiResponse({ status: 200, type: [RecordResponseDto] })
  async findAll(): Promise<RecordResponseDto[]> {
    const records = await this.recordsService.findAll();
    return plainToInstance(RecordResponseDto, records, {
      excludeExtraneousValues: true,
    });
  }

  // FIND SINGLE RECORD
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @ApiOperation({ summary: 'Retrieve a specific medical record by ID' })
  @ApiResponse({ status: 200, type: RecordResponseDto })
  async findOne(@Param('id') id: UUID): Promise<RecordResponseDto> {
    const record = await this.recordsService.findOne(id);
    return plainToInstance(RecordResponseDto, record, {
      excludeExtraneousValues: true,
    });
  }

  // UPDATE RECORD
  @Patch(':id')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update an existing medical record (Doctor only)' })
  @ApiResponse({ status: 200, type: RecordResponseDto })
  async update(
    @Param('id') id: UUID,
    @Body() updateRecordDto: UpdateRecordDto,
    @Req() req: RequestWithUser,
  ): Promise<RecordResponseDto> {
    const userId = req.user.userId;
    const updated = await this.recordsService.update(
      id,
      userId,
      updateRecordDto,
    );
    return plainToInstance(RecordResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  // DELETE RECORD
  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Delete a medical record (Doctor only)' })
  @ApiResponse({ status: 204, description: 'Record deleted successfully' })
  async remove(@Param('id') id: UUID): Promise<void> {
    await this.recordsService.remove(id);
  }
}
