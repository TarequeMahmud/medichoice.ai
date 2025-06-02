import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userProviders } from './users.providers';

@Module({
  controllers: [UsersController],
  providers: [...userProviders, UsersService],
})
export class UsersModule {}
