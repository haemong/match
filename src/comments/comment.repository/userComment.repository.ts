import { InjectRepository } from '@nestjs/typeorm';
import { UserComment } from '../entities/user_comment.entity';
import { Repository } from 'typeorm';

export class UserCommentRepository {
  constructor(
    @InjectRepository(UserComment)
    private userCommentRepository: Repository<UserComment>,
  ) {}

  async allCheck(userId, commentId) {
    return await this.userCommentRepository
      .createQueryBuilder()
      .where({ user: userId, comment: commentId })
      .getExists();
  }

  async createCommentLike(userId, commentId) {
    await this.userCommentRepository
      .createQueryBuilder()
      .insert()
      .values({
        user: userId,
        comment: commentId,
      })
      .execute();

    return {
      success: true,
      message: 'comment like ON',
    };
  }

  async deleteCommentLike(userId, commentId) {
    await this.userCommentRepository
      .createQueryBuilder()
      .delete()
      .where({ user: userId, comment: commentId })
      .execute();

    return {
      success: true,
      message: 'comment like OFF',
    };
  }
}
