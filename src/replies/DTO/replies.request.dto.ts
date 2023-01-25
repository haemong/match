import { PickType } from '@nestjs/swagger';
import { Reply } from '../entities/replies.enetity';
export class ReplyRequestDto extends PickType(Reply, [
  'description',
  'comment',
] as const) {}
