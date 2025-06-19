import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseAuthDto {
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
}
