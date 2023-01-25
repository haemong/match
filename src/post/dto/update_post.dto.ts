import { IsNumber, IsString } from 'class-validator';
import { Category } from '../entities/postingCategory.entity';

export class UpdatePostDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  category: Category;

  @IsString()
  tag: string | null;
}
