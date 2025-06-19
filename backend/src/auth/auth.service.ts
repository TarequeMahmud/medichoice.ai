import { Injectable } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async login(loginDto: LoginDto): Promise<Users> {
    try {
      const { email, password } = loginDto;
      const user = await this.userService.findByEmail(email);
      if (user.password === password) {
        return user;
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
