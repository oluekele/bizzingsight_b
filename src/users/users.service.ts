import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common/decorators';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: { email?: string; password?: string; role?: string },
    currentUser: User,
  ): Promise<User> {
    if (currentUser.id !== Number(id) && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You can only update your own account or must be an admin',
      );
    }
    const user = await this.findOne(id);
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.role && currentUser.role === UserRole.ADMIN) {
      user.role = updateUserDto.role as UserRole;
    }
    return this.userRepository.save(user);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    if (currentUser.id !== Number(id) && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You can only delete your own account or must be an admin',
      );
    }
    const user = await this.findOne(Number(id));
    await this.userRepository.remove(user);
  }
}
