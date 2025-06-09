import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const newUser = this.userRepository.create(createUserDto);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Users[]> {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: UUID): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('No user found in this id.');
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
