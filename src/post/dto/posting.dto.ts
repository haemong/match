import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Posting } from '../entities/posting.entity';

export class PostingDto extends PickType(Posting, [
  'title',
  'description',
  'category',
]) {
  @IsString()
  tag: string | null;
}
