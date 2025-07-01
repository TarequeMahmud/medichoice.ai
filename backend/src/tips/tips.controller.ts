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
import { TipsService } from './tips.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { UUID } from 'crypto';
import { RequestWithUser } from 'src/common/types/auth';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createTipDto: CreateTipDto, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.tipsService.create(userId, createTipDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.tipsService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.tipsService.findOne(id);
  }

  @Roles(UserRole.PATIENT)
  @Get('random')
  getRandomTip() {
    return this.tipsService.getRandom();
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: UUID,
    @Body() updateTipDto: UpdateTipDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.tipsService.update(id, userId, updateTipDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.tipsService.remove(id);
  }
}
