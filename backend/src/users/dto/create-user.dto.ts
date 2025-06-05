import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    minLength: 6,
    maxLength: 128,
    example: 'John Doe',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  full_name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    minLength: 6,
    maxLength: 128,
    example: 'strongPassword123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsString()
  role: UserRole;
}
