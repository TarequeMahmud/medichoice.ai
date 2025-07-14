import { OtpField } from 'src/common/decorators/auth.decorator';
import { BaseAuthDto } from 'src/users/dto/base-auth.dto';

export class ResetPassworDto extends BaseAuthDto {
  @OtpField()
  otp: string;
}
