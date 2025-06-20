import { Injectable } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async login(
    loginDto: LoginDto,
  ): Promise<{ message: string; user: Partial<Users> }> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Invalid credentials');
    }
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
    };
  }
}
