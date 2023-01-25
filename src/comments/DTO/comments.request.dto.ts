import { PickType } from '@nestjs/swagger';
import { Comment } from '../entities/comments.entity';

export class CommentRequesto extends PickType(Comment, [
  'description',
  'post',
] as const) {}
