import { PartialType } from '@nestjs/swagger';
import { CreateTipDto } from './create-tip.dto';

export class UpdateTipDto extends PartialType(CreateTipDto) {}
