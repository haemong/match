import { Comment } from 'src/comments/entities/comments.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserReply } from './user_replies.entitiy';

@Entity({ name: 'replies' })
export class Reply extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
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
  @ManyToOne(() => Comment, (comment) => comment.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment | number;

  @OneToMany(() => UserReply, (userReply) => userReply.reply, {
    cascade: true,
  })
  @JoinColumn({ name: 'reply_id' })
  userReply: UserReply;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
