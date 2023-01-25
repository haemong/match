import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from '../entities/replies.enetity';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

import { Comment } from 'src/comments/entities/comments.entity';

@Injectable()
export class RepliesRepository {
  constructor(
    @InjectRepository(Reply)
    private readonly repliesRepository: Repository<Reply>,
    @InjectRepository(User)
    private userRepositoty: Repository<User>,
  ) {}

  getExistByEmail = async (user: { id: number; email: string }) => {
    const isExistUser = await this.userRepositoty
      .createQueryBuilder()
      .select()
      .where({ email: user.email, id: user.id })
      .orderBy()
      .getExists();

    return isExistUser;
  };

  createReply = async (
    description: string,
    comment: Comment | number,
    userId,
  ) => {
    const createReply = this.repliesRepository.create({
      description,
      comment,
      user: userId,
    });

    await this.repliesRepository.save(createReply);

    return {
      success: true,
      message: '생성 완료 하엿씁니다!',
    };
  };
  getReply = async (comment) => {
    return this.repliesRepository
      .createQueryBuilder()
      .where({ comment })
      .getMany();
  };

  updateReply = async (id, description) => {
    await this.repliesRepository
      .createQueryBuilder()
      .update()
      .set({ description })
      .where({ id: id })
      .execute();

    return {
      message: '대댓글 수정 완료',
    };
  };

  deleteReply = async (param) => {
    await this.repliesRepository
      .createQueryBuilder()
      .delete()
      .where({ id: param })
      .execute();

    return {
      success: true,
      message: '정상적으로 삭제 되었습니다',
    };
  };
}
