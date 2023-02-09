import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesController } from './replies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comments/entities/comments.entity';
import { User } from 'src/auth/entities/user.entity';
import { Reply } from './entities/replies.enetity';
import { RepliesRepository } from './repositories/replies.repository';
import { UserRepliesRepository } from './repositories/user_replies.repository';
import { UserReply } from './entities/user_replies.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Reply, UserReply])],
  providers: [RepliesService, RepliesRepository, UserRepliesRepository],
  controllers: [RepliesController],
})
export class RepliesModule {}
