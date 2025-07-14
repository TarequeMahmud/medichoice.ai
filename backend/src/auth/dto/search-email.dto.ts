import { EmailField } from 'src/common/decorators/auth.decorator';

export class SearchEmailDto {
  @EmailField()
  email: string;
}
