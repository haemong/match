import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/postingCategory.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async validationCheckCategoryId(category) {
    const validationCheckCategoryId = await this.categoryRepository
      .createQueryBuilder()
      .where({ id: category })
      .getExists();

    return validationCheckCategoryId;
  }
}
