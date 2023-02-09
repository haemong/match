import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reply } from './replies.enetity';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'user_reply' })
export class UserReply extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @ManyToOne(() => Reply, (reply) => reply.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reply_id' })
  reply: Reply;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
