import {
  EmailField,
  PasswordField,
} from 'src/common/decorators/auth.decorator';

export class BaseAuthDto {
  @EmailField()
  email: string;
  @PasswordField()
  password: string;
}
