import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { messageProviders } from './messages.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MessagesController],
  providers: [...messageProviders, MessagesService],
})
export class MessagesModule {}
