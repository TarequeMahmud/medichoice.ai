import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      console.log('validation errors', errors);
      const messages = errors
        .map((err) => (err.constraints ? Object.values(err.constraints) : []))
        .flat();

      throw new BadRequestException(messages);
    }
    return value;
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    console.log(metatype);

    return !types.includes(metatype);
  }
}
/*
validation errors [
  ValidationError {
    target: CreateUserDto {
      full_name: 'Tareqye',
      email: 'adfh@fggd.d',
      password: 'strdfing',
      role: 'admin'
    },
    value: 'adfh@fggd.d',
    property: 'email',
    children: [],
    constraints: { isEmail: 'email must be an email' }
  }
]

*/
