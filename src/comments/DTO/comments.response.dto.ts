import { PickType } from '@nestjs/swagger';
import { Comment } from '../entities/comments.entity';

export class CommentsResponseDto extends PickType(Comment, [
  'description',
  'post',
  'createdAt',
] as const) {}
