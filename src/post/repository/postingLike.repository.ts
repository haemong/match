import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostingLike } from '../entities/postingLike.entity';

@Injectable()
export class PostingLikeRepository {
  constructor(
    @InjectRepository(PostingLike)
    private postingLikeRepository: Repository<PostingLike>,
  ) {}

  async allCheck(userId, postingId) {
    const allCheck = await this.postingLikeRepository
      .createQueryBuilder()
      .where({ user: userId, posting: postingId })
      .getExists();

    return allCheck;
  }

  async createPostingLike(userId, postingId) {
    await this.postingLikeRepository.query(
      `INSERT INTO postingLikes (user_id, posting_id) VALUE ('${userId}', ${postingId})`,
    );
  }

  async deletePostingLike(userId, postingId) {
    await this.postingLikeRepository.query(
      `DELETE FROM postingLikes WHERE user_id = ${userId} AND posting_id = ${postingId}`,
    );
  }
}
