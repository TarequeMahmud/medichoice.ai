import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import generateCookie from 'src/common/utils/generateCookie';
import { UsersService } from 'src/users/users.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { sendOtp } from 'src/common/utils/sendOtp';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(loginDto);
    return generateCookie(res, token.access_token);
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const verificatioOtp = await this.authService.register(createUserDto);
    await sendOtp(createUserDto.email, verificatioOtp);
    return {
      message: 'User registered successfully. Please check your email for OTP.',
    };
  }

  @Post('/verify-otp')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, otp } = verifyOtpDto;
    const isValid = await this.authService.verifyOtp(email, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const user = await this.userService.findByEmail(email);
    const token = await this.authService.login({
      email: user!.email,
      password: user!.password,
    });

    return generateCookie(res, token.access_token);
  }
}
