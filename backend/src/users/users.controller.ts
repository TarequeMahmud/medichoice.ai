import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Users } from './entities/user.entity';
import { ApiValidationError } from 'src/common/decorators/swagger/bad-request.decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { UUID } from 'crypto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Users,
  })
  @ApiValidationError()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Successful request returned with an array with users',
    type: [Users],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Successfully returns the expected user',
    type: Users,
  })
  @ApiNotFoundResponse({
    description: 'No user found in this id.',
    content: {
      'application/json': {
        example: {
          message: 'No user found in this id.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiParam({ name: 'id', type: 'string', description: 'User UUID' })
  findOne(@Param('id') id: UUID) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({
    description: 'Fields to update for the user',
    type: UpdateUserDto,
    examples: {
      emailUpdate: {
        summary: 'Update user email only',
        value: {
          email: 'updated.email@example.com',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No user found in this id.',
    content: {
      'application/json': {
        example: {
          message: 'No user found in this id.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Successfully returns the updated user',
    type: Users,
  })
  @ApiValidationError()
  @ApiParam({ name: 'id', type: 'string', description: 'User UUID' })
  update(@Param('id') id: UUID, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Successfully deleted the user',
  })
  @ApiNotFoundResponse({
    description: 'No user found in this id.',
    content: {
      'application/json': {
        example: {
          message: 'No user found in this id.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiParam({ name: 'id', type: 'string', description: 'User UUID' })
  remove(@Param('id') id: UUID) {
    return this.usersService.remove(id);
  }
}
