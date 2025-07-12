import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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

  async register(
    registerDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const newUser = await this.userService.create(registerDto);

    if (!newUser) {
      throw new UnauthorizedException('Registration failed');
    }
    const loginDto: LoginDto = {
      email: newUser.email,
      password: registerDto.password,
    };
    const token = await this.login(loginDto);
    return token;
  }
}
