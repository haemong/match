import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posting } from './entities/posting.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import * as dotenv from 'dotenv';
import { AuthModule } from 'src/auth/auth.module';
import { Category } from './entities/postingCategory.entity';
import { Tag } from './entities/postingTag.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionsFactory } from 'src/common/utils/multer.options';
import { postingImage } from './entities/postingImage.entity';
import { PostingLike } from './entities/postingLike.entity';
import { PostingRepository } from './repository/posting.repository';
import { TagRepository } from './repository/tag.repository';
import { CategoryRepository } from './repository/category.repository';
import { PostingImagesRepository } from './repository/postingImage.repository';
import { PostingLikeRepository } from './repository/postingLike.repository';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Posting,
      Category,
      Tag,
      postingImage,
      PostingLike,
      PostingRepository,
      CategoryRepository,
      TagRepository,
      PostingImagesRepository,
      PostingLikeRepository,
    ]),
    AuthModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    PostingRepository,
    CategoryRepository,
    TagRepository,
    PostingImagesRepository,
    PostingLikeRepository,
  ],
})
export class PostModule {}
