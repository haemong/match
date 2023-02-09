import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
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
import { Category } from './postingCategory.entity';
import { PostingLike } from './postingLike.entity';
import { postingImage } from './postingImage.entity';
import { Tag } from './postingTag.entity';
import { Comment } from 'src/comments/entities/comments.entity';

@Entity({ schema: 'match', name: 'postings' })
export class Posting extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'id',
    type: 'number',
  })
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'title',
    type: 'string',
  })
  title: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'description',
    type: 'string',
  })
  description: string;

  @Column({ default: 0 })
  @IsNumber()
  @ApiProperty({
    description: 'views',
    type: 'number',
  })
  views?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @ManyToOne((_type) => User, (user) => user.postings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @IsNotEmpty()
  @ManyToOne((_type) => Category, (category) => category.postings, {
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany((_type) => Tag, (tag) => tag.posting, {
    cascade: true,
  })
  tags?: Tag[];

  @OneToMany((_type) => postingImage, (postingImage) => postingImage.posting, {
    cascade: true,
  })
  postingImage?: postingImage[];

  @OneToMany((_type) => PostingLike, (postingLike) => postingLike.posting, {
    cascade: true,
  })
  postingLikes?: PostingLike[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comment?: Comment[];
}
