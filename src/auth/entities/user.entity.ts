import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Posting } from 'src/post/entities/posting.entity';
import { PostingLike } from 'src/post/entities/postingLike.entity';
import { UserComment } from 'src/comments/entities/user_comment.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity({ schema: 'match', name: 'users' })
@Unique(['email', 'nickname'])
export class User extends BaseEntity {
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
    description: 'email',
    type: 'string',
    uniqueItems: true,
  })
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message: 'Invalid password',
  })
  @ApiProperty({
    description: 'password',
    type: 'string',
  })
  password: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'username',
    type: 'string',
  })
  username: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'username',
    type: 'string',
    uniqueItems: true,
  })
  nickname: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @OneToMany((_type) => Posting, (posting) => posting.user, {
    cascade: true,
  })
  postings: Posting[];

  @OneToMany((_type) => PostingLike, (postingLike) => postingLike.user, {
    cascade: true,
  })
  userLikes?: PostingLike[];

  @OneToMany(() => UserComment, (userComment) => userComment.user)
  @JoinColumn()
  userComment: UserComment[];
}
