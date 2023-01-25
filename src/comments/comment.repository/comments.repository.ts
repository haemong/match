import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepositoty: Repository<User>,
  ) {}

  async getExistByEmail(email) {
    return await this.userRepositoty
      .createQueryBuilder()
      .select()
      .where({ email })
      .getExists();
  }

  async getExistByUserId(userId) {
    return await this.userRepositoty
      .createQueryBuilder()
      .select()
      .where({ id: userId })
      .getExists();
  }

  async create(description, post) {
    const comment = this.commentRepository.create({
      description,
      post,
    });

    await this.commentRepository.save(comment);

    return {
      success: true,
      message: 'Write Comment complete',
    };
  }

  async update(description, commentId) {
    const updateResult = await this.commentRepository
      .createQueryBuilder()
      .update()
      .set({ description })
      .where({ id: commentId })
      .execute();

    return updateResult;
  }

  async getPostIdByCommentId(post) {
    return await this.commentRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Comment.commentImage', 'CommentImage')
      .where({ post })
      .getMany();
  }

  async isExistCommentById(commentId) {
    return await this.commentRepository
      .createQueryBuilder()
      .where({ id: commentId })
      .getExists();
  }

  async delete(commentId) {
    await this.commentRepository
      .createQueryBuilder()
      .delete()
      .where({ id: commentId })
      .execute();
  }
}
