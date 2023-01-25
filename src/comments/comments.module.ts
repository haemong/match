import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comments.entity';
import { User } from '../auth/entities/user.entity';
import { CommentRepository } from './comment.repository/comments.repository';
import { Posting } from 'src/post/entities/posting.entity';
import { UserRepositoty } from 'src/auth/auth.repository';
import { UserCommentRepository } from './comment.repository/userComment.repository';
import { UserComment } from './entities/user_comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Posting, UserComment])],
  providers: [
    CommentsService,
    CommentRepository,
    UserRepositoty,
    UserCommentRepository,
  ],
  controllers: [CommentsController],
})
export class CommentsModule {}
