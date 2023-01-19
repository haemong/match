import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posting } from '../entities/posting.entity';
import { PostingLike } from '../entities/postingLike.entity';

@Injectable()
export class PostingRepository {
  constructor(
    @InjectRepository(Posting)
    private postingRepository: Repository<Posting>,
  ) {}

  async getPostingInfo() {
    const postingInfo = await this.postingRepository
      .createQueryBuilder('posting')
      .leftJoin('posting.category', 'category')
      .leftJoin('posting.user', 'user')
      .leftJoin('posting.tags', 'tag')
      .leftJoin('posting.postingImage', 'postingImage')
      .select([
        'posting.id',
        'posting.title',
        'posting.description',
        'posting.views',
        'posting.createdAt',
        'category.name',
        'user.id',
        'user.username',
        'tag',
        'postingImage',
      ])
      .loadRelationCountAndMap(
        'posting.postingLikesCount',
        'posting.postingLikes',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(postinglikes.posting)', 'likecount')
          .from(PostingLike, 'postinglikes')
          .where('postinglikes.posting.id = posting.id');
      }, 'count');

    return postingInfo;
  }

  async checkUserId(userId) {
    const checkUserId = await this.postingRepository
      .createQueryBuilder()
      .where({ user: userId })
      .getExists();

    return checkUserId;
  }

  async getPostingLike(userId, orderFiltering) {
    const getPostingInfo = await this.getPostingInfo();
    return getPostingInfo
      .leftJoinAndSelect('posting.postingLikes', 'likes', 'likes.user = :id', {
        id: userId,
      })
      .orderBy({ [orderFiltering]: 'DESC' })
      .getMany();
  }

  async plusView(postingId) {
    await this.postingRepository
      .createQueryBuilder()
      .update(Posting)
      .set({ views: () => 'views + 1' })
      .where('id = :postingId', { postingId })
      .execute();
  }

  async checkPostingId(postingId) {
    const checkPostingId = await this.postingRepository
      .createQueryBuilder()
      .where({ id: postingId })
      .getExists();

    return checkPostingId;
  }

  async createSavePosting(title, description, user, category) {
    const createPosting = await this.postingRepository.create({
      title,
      description,
      user,
      category,
    });

    return await this.postingRepository.save(createPosting);
  }

  async allCheck(userId, postingId) {
    const allCheck = await this.postingRepository
      .createQueryBuilder()
      .where({ user: userId, id: postingId })
      .getExists();

    return allCheck;
  }

  async updatePosting(title, description, category, postingId) {
    await this.postingRepository
      .createQueryBuilder()
      .update(Posting)
      .set({
        title: title,
        description: description,
        category: category,
      })
      .where({ id: postingId })
      .execute();
  }

  async deletePosting(postingId) {
    await this.postingRepository.delete(postingId);
  }
}
