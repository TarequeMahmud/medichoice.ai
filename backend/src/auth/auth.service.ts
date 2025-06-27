import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

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
}
