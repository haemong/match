import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/postingTag.entity';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async tagLIKE(el) {
    const tagLIKE = this.tagRepository.query(
      `SELECT posting_id FROM tags WHERE title LIKE '%${el}%'`,
    );
    return tagLIKE;
  }

  async createPostingTag(el, savePost) {
    await this.tagRepository.query(
      `INSERT INTO tags (title, posting_id) VALUE ('${el}', ${savePost.id})`,
    );
  }

  async deleteTag(postingId) {
    await this.tagRepository.query(
      `DELETE FROM tags WHERE posting_id = ${postingId}`,
    );
  }

  async updatePostingTag(el, postingId) {
    await this.tagRepository.query(
      `INSERT INTO tags (title, posting_id) VALUE ('${el}', ${postingId})`,
    );
  }
}
