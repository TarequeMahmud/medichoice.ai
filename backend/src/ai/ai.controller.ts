import { Body, Controller, Post } from '@nestjs/common';
import { AiDto } from './dto/ai.dto';
import { AiService } from './ai.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}
  @Post()
  @ApiOkResponse({
    description: 'Successful request returned ai response text (in markdown)',
    schema: {
      example: {
        response:
          'Based on available information, **Dr. Sarah Ahmed** is highly recommended for dental surgery in this area.\n\nPlease consult with the clinic for appointment availability.',
      },
    },
  })
  aiResponse(@Body() aiDto: AiDto) {
    return this.aiService.generateAiResponse(aiDto);
  }
}
