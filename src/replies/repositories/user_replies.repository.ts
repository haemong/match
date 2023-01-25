import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReply } from '../entities/user_replies.entitiy';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepliesRepository {
  constructor(
    @InjectRepository(UserReply)
    private userReplyRepository: Repository<UserReply>,
  ) {}

  async checklikeReply(userId, replyId) {
    return await this.userReplyRepository
      .createQueryBuilder()
      .where({ user: userId, reply: replyId })
      .getExists();
  }

  async createReplyLike(userId, replyId) {
    await this.userReplyRepository
      .createQueryBuilder()
      .insert()
      .values({
        user: userId,
        reply: replyId,
      })
      .execute();

    return {
      success: true,
      message: 'reply like ON',
    };
  }

  async deleteReplyLike(userId, replyId) {
    await this.userReplyRepository
      .createQueryBuilder()
      .delete()
      .where({ user: userId, reply: replyId })
      .execute();

    return {
      success: true,
      message: 'reply like OFF',
    };
  }
}
