import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { Repository } from 'typeorm';
import { Tips } from './entities/tip.entity';
import { UsersService } from 'src/users/users.service';
import { UUID } from 'crypto';

@Injectable()
export class TipsService {
  constructor(
    @Inject('TIP_REPOSITORY')
    private tipRepository: Repository<Tips>,
    private userService: UsersService,
  ) {}
  async create(adminId: UUID, createTipDto: CreateTipDto) {
    const user = await this.userService.findOne(adminId);
    if (!user || user.role !== 'admin')
      throw new UnauthorizedException('You are not authorized.');
    const tip = this.tipRepository.create(createTipDto);
    return await this.tipRepository.save(tip);
  }

  async findAll() {
    return await this.tipRepository.find();
  }

  async findOne(id: UUID) {
    return await this.tipRepository.findOne({ where: { id } });
  }

  async getRandom() {
    const tips = await this.tipRepository.find();
    if (tips.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  }

  async update(id: UUID, adminId: UUID, updateTipDto: UpdateTipDto) {
    const user = await this.userService.findOne(adminId);
    if (!user || user.role !== 'admin')
      throw new UnauthorizedException('You are not authorized.');
    await this.tipRepository.update(id, updateTipDto);
    return await this.tipRepository.findOne({ where: { id } });
  }

  async remove(id: UUID) {
    const tip = await this.tipRepository.findOne({ where: { id } });
    if (tip) {
      await this.tipRepository.remove(tip);
    }
    return tip;
  }
}
