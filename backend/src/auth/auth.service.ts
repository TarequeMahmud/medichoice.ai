import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Keyv } from 'keyv';
import { ConfigService } from '@nestjs/config';
import { SearchEmailDto } from './dto/search-email.dto';
import { sendOtp } from 'src/common/utils/sendOtp';
import { ResetPassworDto } from './dto/reset-password.dto';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
  private keyv: Keyv;
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.keyv = new Keyv(configService.get('REDIS_URL'), {
      ttl: 10 * 60 * 1000,
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<Users> | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    if (user.password !== password) return null;

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    console.log(loginDto);
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
  }

  async register(registerDto: CreateUserDto): Promise<string> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const newUser = await this.userService.create(registerDto);

    const otp = await this.generateOtp(newUser.email);
    return otp;
  }

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(email);

    const savedotp = await this.keyv.set(`otp:${email}`, otp, 5 * 60 * 1000);
    console.log(savedotp);

    return otp;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.keyv.get<string>(`otp:${email}`);

    console.log(`Stored OTP for ${email}: ${storedOtp}`);

    if (!storedOtp) return false;

    const isValid = storedOtp === otp;

    if (isValid) {
      await this.keyv.delete(`otp:${email}`);
    }

    return isValid;
  }

  async recovery(searchEmailDto: SearchEmailDto): Promise<string> {
    const { email } = searchEmailDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const otp = await this.generateOtp(email);
    console.log(`Sending OTP to ${email}: ${otp}`);
    await sendOtp(email, otp);

    return 'Recovery OTP sent to your email.';
  }

  async changePassword(resetPasswordDto: ResetPassworDto): Promise<string> {
    const { email, otp, password } = resetPasswordDto;

    const isValidOtp = await this.verifyOtp(email, otp);
    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.userService.update(user.id as UUID, {
      password,
    });

    const access_token = await this.login({ email, password });

    return access_token.access_token;
  }
}
