import { PickType } from '@nestjs/swagger';
import { Reply } from '../entities/replies.enetity';
export class ReplyUpdateRequestDto extends PickType(Reply, [
  'description',
  'id',
] as const) {}
