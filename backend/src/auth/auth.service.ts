import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Keyv } from 'keyv';
import { ConfigService } from '@nestjs/config';

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
      role: user.role,
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    console.log(loginDto);
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
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

    // Save OTP with TTL (e.g., 5 mins)
    await this.keyv.set(`otp:${email}`, otp, 300);

    return otp;
  }
}
