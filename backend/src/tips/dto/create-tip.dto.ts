import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipDto {
  @ApiProperty({
    example: '5 Easy Ways to Reduce Stress',
    description: 'Tip title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Take short walks, practice breathing...',
    description: 'Full content of the tip',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
