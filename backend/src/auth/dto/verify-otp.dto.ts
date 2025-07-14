import { EmailField, OtpField } from 'src/common/decorators/auth.decorator';

export class VerifyOtpDto {
  @EmailField()
  email: string;

  @OtpField()
  otp: string;
}
