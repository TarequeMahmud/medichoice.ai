import { IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BaseAuthDto } from 'src/users/dto/base-auth.dto';

export class CreateUserDto extends BaseAuthDto {
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
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsString()
  role: UserRole;
}
