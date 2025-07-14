import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from 'src/users/entities/user.entity';

export function EmailField() {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      description: 'Email address of the user',
      example: 'john.doe@example.com',
    })(target, propertyKey);

    IsEmail()(target, propertyKey);
  };
}

export function PasswordField() {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      description: 'Password for the user account',
      minLength: 6,
      maxLength: 128,
      example: 'strongPassword123',
    })(target, propertyKey);

    IsString()(target, propertyKey);
    MinLength(6)(target, propertyKey);
    MaxLength(128)(target, propertyKey);
  };
}

export function OtpField() {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      description: 'One-time password for verification',
      minLength: 6,
      maxLength: 6,
      example: '123456',
    })(target, propertyKey);

    IsString()(target, propertyKey);
    MinLength(6)(target, propertyKey);
    MaxLength(6)(target, propertyKey);
  };
}

export function FullNameField() {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      description: 'Full name of the user',
      minLength: 6,
      maxLength: 128,
      example: 'John Doe',
    })(target, propertyKey);

    IsString()(target, propertyKey);
    MinLength(6)(target, propertyKey);
    MaxLength(128)(target, propertyKey);
  };
}

export function RoleField() {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      description: 'Role of the user',
      enum: UserRole,
      example: UserRole.ADMIN,
    })(target, propertyKey);

    IsString()(target, propertyKey);
  };
}
