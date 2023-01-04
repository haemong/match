import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { postingImage } from '../entities/postingImage.entity';

@Injectable()
export class PostingImagesRepository {
  constructor(
    @InjectRepository(postingImage)
    private postingImageRepository: Repository<postingImage>,
  ) {}

  async createPostingImage(files, savePost) {
    const imageResult = files.map((el) => [el.location, el.key]);
    for (let i = 0; i < imageResult.length; i++) {
      this.postingImageRepository.query(
        `INSERT INTO postingImages (url, name, posting_id) VALUE (
            '${imageResult[i][0]}', '${imageResult[i][1]}', '${savePost.id}'
          )`,
      );
    }
  }

  async selectPostingImage(postingId) {
    return await this.postingImageRepository
      .createQueryBuilder('postingImages')
      .leftJoin('postingImages.posting', 'posting')
      .select(['postingImages.name'])
      .where('posting.id = :postingId', { postingId })
      .getMany();
  }

  async deletePostingImage(postingId) {
    await this.postingImageRepository.query(
      `DELETE FROM postingImages WHERE posting_id = ${postingId}`,
    );
  }

  async updatePostingImage(files, postingId) {
    const imageResult = files.map((el) => [el.location, el.key]);
    for (let i = 0; i < imageResult.length; i++) {
      this.postingImageRepository.query(
        `INSERT INTO postingImages (url, name, posting_id) VALUE (
            '${imageResult[i][0]}', '${imageResult[i][1]}', '${postingId}'
          )`,
      );
    }
  }
}
