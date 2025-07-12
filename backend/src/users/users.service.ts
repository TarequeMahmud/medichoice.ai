import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { UUID } from 'crypto';
import { rethrowIfError } from 'src/common/utils/rethrowIfError';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findAll(): Promise<Users[]> {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error: unknown) {
      rethrowIfError(error);
    }
  }

  async findOne(id: UUID): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('No user found in this id.');
      }
      return user;
    } catch (error: unknown) {
      rethrowIfError(error);
    }
  }

  async findByEmail(email: string): Promise<Users | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  async update(id: UUID, updateUserDto: UpdateUserDto): Promise<Users> {
    try {
      const user = await this.findOne(id);
      Object.assign(user, updateUserDto);
      const updatedUser = await this.userRepository.save(user);

      return updatedUser;
    } catch (error: unknown) {
      rethrowIfError(error);
    }
  }

  async remove(id: UUID): Promise<void> {
    try {
      await this.findOne(id);
      await this.userRepository.delete(id);
    } catch (error: unknown) {
      rethrowIfError(error);
    }
  }
}
