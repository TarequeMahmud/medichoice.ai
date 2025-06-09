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

  async update(id: UUID, updateUserDto: UpdateUserDto): Promise<Users> {
    try {
      const user = await this.findOne(id);
      for (let key in updateUserDto) {
        user[key] = updateUserDto[key];
      }
      const updatedUser = await this.userRepository.save(user);

      return updatedUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(id: UUID): Promise<void> {
    try {
      await this.findOne(id);
      await this.userRepository.delete(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
