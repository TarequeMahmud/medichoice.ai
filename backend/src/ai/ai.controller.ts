import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiDto } from './dto/ai.dto';
import { AiService } from './ai.service';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
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
