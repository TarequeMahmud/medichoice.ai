import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { messageProviders } from './messages.providers';
import { DatabaseModule } from 'src/database/database.module';
import { MessagesGateway } from './messages.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client'),
      exclude: ['/api/{*test}'],
      serveRoot: '/message/test',
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
  ],
  controllers: [MessagesController],
  providers: [...messageProviders, MessagesService, MessagesGateway],
})
export class MessagesModule {}
