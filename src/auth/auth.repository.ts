import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepositoty {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getEmail(email) {
    const getEmail = await this.userRepository
      .createQueryBuilder()
      .where({ email: email })
      .getExists();

    return getEmail;
  }

  async getNickname(nickname) {
    const getNickname = await this.userRepository
      .createQueryBuilder()
      .where({ nickname: nickname })
      .getExists();

    return getNickname;
  }

  async signUpUser(email, hashedPassword, username, nickname) {
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
      nickname,
    });

    try {
      await this.userRepository.save(user);
      return { success: true };
    } catch (error) {
      throw new HttpException('signUp error', 404);
    }
  }

  async findUserInfo(id, email) {
    const user = await this.userRepository.findOneBy({ id, email });

    return user;
  }

  async checkUserId(userId) {
    return await this.userRepository
      .createQueryBuilder()
      .where({ id: userId })
      .getExists();
  }

  async getNicknameById(userId: number) {
    return await this.userRepository
      .createQueryBuilder()
      .select()
      .where({ id: userId })
      .getOne();
  }
}
