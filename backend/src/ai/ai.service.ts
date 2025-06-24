import { Injectable } from '@nestjs/common';
import { AiDto } from './dto/ai.dto';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  async generateAiResponse(
    aiDto: AiDto,
  ): Promise<{ response: string | undefined }> {
    const { search_prompt } = aiDto;

    const chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      history: [
        {
          role: 'user',
          parts: [{ text: 'Hello' }],
        },
        {
          role: 'model',
          parts: [{ text: 'Great to meet you. What would you like to know?' }],
        },
        {
          role: 'user',
          parts: [{ text: 'I have 2 dogs in my house.' }],
        },
      ],
    });

    const response = await chat.sendMessage({ message: search_prompt });

    return { response: response.text };
  }
}
