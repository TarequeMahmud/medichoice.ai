import { IsUUID, IsString } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;

  @IsString()
  content: string;
}
