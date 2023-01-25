import { IsNotEmpty, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserComment } from './user_comment.entity';
import { Reply } from '../../replies/entities/replies.enetity';
import { Posting } from 'src/post/entities/posting.entity';
import { UserReply } from '../../replies/entities/user_replies.entitiy';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @IsNotEmpty()
  @ManyToOne(() => Posting, (posting) => posting.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Posting | number | string;

  @OneToMany(() => UserComment, (userComment) => userComment.comment, {
    cascade: true,
  })
  userComment: UserComment[];

  @OneToMany(() => Reply, (reply) => reply.comment, { cascade: true })
  reply: Reply[];

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
