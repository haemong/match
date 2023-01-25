import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CommentsResponseDto } from '../DTO/comments.response.dto';

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

  async create(description, post, userId) {
    const comment = this.commentRepository.create({
      description,
      post,
      user: userId,
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
      // .leftJoinAndSelect('Comment.commentImage', 'CommentImage')
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

  async getCommentByPostId(post): Promise<CommentsResponseDto[]> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.description',
        'comment.createdAt',
        'cUser.nickname',
        'reply.id',
        'reply.description',
        'rUser.nickname',
        'reply.createdAt',
        'commentLike',
        'commentUser.nickname',
        'commentUser.id',
        'replyLike',
        'replyUser.nickname',
        'replyUser.id',
      ])
      .leftJoin('comment.user', 'cUser')
      .leftJoin('comment.userComment', 'commentLike')
      .leftJoin('commentLike.user', 'commentUser')
      .leftJoin('comment.reply', 'reply')
      .leftJoin('reply.user', 'rUser')
      .leftJoin('reply.userReply', 'replyLike')
      .leftJoin('replyLike.user', 'replyUser')
      .where({ post })
      .getMany();
  }
}
