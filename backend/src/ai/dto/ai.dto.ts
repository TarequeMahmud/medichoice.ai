import { IsString, MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AiDto {
  @ApiProperty({
    description: 'The message to be sent to ai for response',
    maxLength: 1000,
    example: 'Who is the best doctor for dental surgery here?',
  })
  @IsString()
  @MaxLength(1000)
  search_prompt: string;
}
