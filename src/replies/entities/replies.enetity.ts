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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

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

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  user: User[];
}
