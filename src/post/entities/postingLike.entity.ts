import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posting } from './posting.entity';

@Entity({ schema: 'match', name: 'postingLikes' })
export class PostingLike extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'id',
    type: 'number',
  })
  id: number;

  @ManyToOne((_type) => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne((_type) => Posting, (posting) => posting.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'posting_id' })
  posting: Posting;
}
