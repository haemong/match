import { HttpException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CategoryRepository } from './repository/category.repository';
import { PostingDto } from './dto/posting.dto';
import { Posting } from './entities/posting.entity';
import { PostingRepository } from './repository/posting.repository';
import { PostingImagesRepository } from './repository/postingImage.repository';
import { TagRepository } from './repository/tag.repository';
import { PostingLikeRepository } from './repository/postingLike.repository';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { orderBy } from 'src/common/utils/orderBy';
import { successBoolean } from 'src/common/utils/successResponse';
import { UserComment } from 'src/comments/entities/user_comment.entity';

@Injectable()
export class PostService {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private postingRepository: PostingRepository,
    private categoryRepository: CategoryRepository,
    private tagRepository: TagRepository,
    private postingImageRepository: PostingImagesRepository,
    private postingLikeRepository: PostingLikeRepository,
  ) {}

  async getAllPosting(user, order): Promise<Posting[]> {
    const orderFiltering = await orderBy(order);

    const postingInfo = await this.postingRepository.getPostingInfo();

    if (!user) {
      return postingInfo.orderBy({ [orderFiltering]: 'DESC' }).getMany();
    }

    const userId = user.id;

    return await this.postingRepository.getPostingLike(userId, orderFiltering);
  }

  async getPostingByUserId(user, userId: string, order): Promise<Posting[]> {
    const orderFiltering = await orderBy(order);

    const checkUserId = await this.postingRepository.checkUserId(userId);

    if (!checkUserId)
      throw new HttpException('user가 게시물을 등록하지 않았습니다', 404);

    const postingInfo = await this.postingRepository.getPostingInfo();

    if (!user) {
      return postingInfo
        .where('user.id = :userId', { userId })
        .orderBy({ [orderFiltering]: 'DESC' })
        .getMany();
    }

    const userIdInfo = user.id;

    const postingResult = postingInfo
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('posting.postingLikes', 'likes', 'likes.user = :id', {
        id: userIdInfo,
      })
      .orderBy({ [orderFiltering]: 'DESC' })
      .getMany();

    return postingResult;
  }

  async getPostingByPostingId(
    user,
    postingId: string,
    order,
  ): Promise<Posting[]> {
    const checkPostingId = await this.postingRepository.checkPostingId(
      postingId,
    );

    if (!checkPostingId) {
      throw new HttpException('존재하지 않는 게시물입니다', 404);
    }

    await this.postingRepository.plusView(postingId);

    const orderFiltering = await orderBy(order);

    const postingInfo = await this.postingRepository.getPostingInfo();

    if (!user) {
      return postingInfo
        .where('posting.id = :postingId', { postingId })
        .orderBy({ [orderFiltering]: 'DESC' })
        .getMany();
    }

    const userId = user.id;

    return postingInfo
      .where('posting.id = :postingId', { postingId })
      .leftJoinAndSelect('posting.postingLikes', 'likes', 'likes.user = :id', {
        id: userId,
      })
      .orderBy({ [orderFiltering]: 'DESC' })
      .getMany();
  }

  async getPostingByTagId(user, getPostingByTagId, order): Promise<any> {
    const orderFiltering = await orderBy(order);

    const { title } = getPostingByTagId;

    const posts = await Promise.all(
      title.map(async (el) => this.tagRepository.tagLIKE(el)),
    );

    const emptyArray = [];
    for (let i = 0; i < posts.length; i++) {
      for (let j = 0; j < posts[i].length; j++) {
        emptyArray.push(posts[i][j]['posting_id']);
      }
    }

    const arrayResult = emptyArray.filter(
      (x, y) => emptyArray.indexOf(x) === y,
    );

    if (arrayResult.length == 0) {
      throw new HttpException('일치하는 태그가 없습니다', 404);
    }

    const postingInfo = await this.postingRepository.getPostingInfo();

    if (!user) {
      const finalResult = await Promise.all(
        arrayResult.map(async (el) =>
          postingInfo
            .where('posting.id = :id', { id: el })
            .orderBy({ [orderFiltering]: 'DESC' })
            .getMany(),
        ),
      );
      return finalResult;
    }

    const userId = user.id;

    const finalResult = await Promise.all(
      arrayResult.map(async (el) =>
        postingInfo
          // .leftJoinAndSelect(
          //   'posting.postingLikes',
          //   'likes',
          //   'likes.user = :id',
          //   {
          //     id: userId,
          //   },
          // )
          .where('posting.id = :id', { id: el })
          .orderBy({ [orderFiltering]: 'DESC' })
          .getMany(),
      ),
    );
    return finalResult;
  }

  async createPosting(
    user,
    postingDto: PostingDto,
    files,
  ): Promise<successBoolean> {
    const userId = user.id;

    const jwtCheck = await this.authService.checkUserId(userId);

    if (!jwtCheck) {
      throw new HttpException('Invalid UserID', 404);
    }

    const { title, description, category, tag } = postingDto;

    const validationCheckCategoryId =
      await this.categoryRepository.validationCheckCategoryId(category);

    if (!validationCheckCategoryId) {
      throw new HttpException('Invalid categoryId', 404);
    }

    const savePost = await this.postingRepository.createSavePosting(
      title,
      description,
      user,
      category,
    );

    if (files) {
      await this.postingImageRepository.createPostingImage(files, savePost);
    }

    if (tag.length !== 0) {
      const tagResult = tag.split(',');
      tagResult.map((el) => this.tagRepository.createPostingTag(el, savePost));
    }

    return { success: true, message: 'posting create success' };
  }

  async updatePosting(
    user,
    postingId,
    postingDto: PostingDto,
    files,
  ): Promise<successBoolean> {
    const userId = user.id;

    const jwtCheck = this.authService.checkUserId(userId);

    if (!jwtCheck) {
      throw new HttpException('Invalid UserID', 404);
    }

    const checkUserId = await this.postingRepository.checkUserId(userId);

    if (!checkUserId)
      throw new HttpException('posting table에 user_id가 없습니다', 404);

    const { title, description, category, tag } = postingDto;

    const allCheck = await this.postingRepository.allCheck(userId, postingId);

    if (!allCheck) {
      throw new HttpException(
        '업데이트 할 수 있는 게시물이 존재하지 않습니다',
        404,
      );
    }

    await this.postingRepository.updatePosting(
      title,
      description,
      category,
      postingId,
    );

    await this.tagRepository.deleteTag(postingId);

    const tagResult = tag.split(',');
    if (tagResult.length !== 0) {
      tagResult.map((el) => this.tagRepository.updatePostingTag(el, postingId));
    }

    const imageName = await this.postingImageRepository.selectPostingImage(
      postingId,
    );

    if (imageName.length != 0) {
      const imageNameResult = imageName.map((el) => el.name);

      const s3 = new AWS.S3({
        region: this.configService.get('AWS_BUCKET_REGION'),
        credentials: {
          accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        },
      });

      for (const el of imageNameResult) {
        const deleteParams = {
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: el,
        };
        await s3.deleteObject(deleteParams).promise();
      }

      await this.postingImageRepository.deletePostingImage(postingId);
    }

    if (files) {
      await this.postingImageRepository.updatePostingImage(files, postingId);
    }

    return { success: true, message: 'posting update success' };
  }

  async deletePosting(user, postingId: string): Promise<successBoolean> {
    const userId = user.id;

    const jwtCheck = this.authService.checkUserId(userId);

    if (!jwtCheck) {
      throw new HttpException('Invalid UserID', 404);
    }

    const checkUserId = await this.postingRepository.checkUserId(userId);

    if (!checkUserId)
      throw new HttpException('posting table에 user_id가 없습니다', 404);

    const allCheck = await this.postingRepository.allCheck(userId, postingId);

    if (allCheck) {
      await this.postingRepository.deletePosting(postingId);
      return { success: true, message: 'posting delete success' };
    } else {
      throw new HttpException('삭제할 게시물이 존재하지 않습니다', 404);
    }
  }

  async likePosting(user, postingId: string): Promise<successBoolean> {
    const userId = user.id;

    const jwtCheck = this.authService.checkUserId(userId);

    if (!jwtCheck) {
      throw new HttpException('Invalid UserID', 404);
    }
    const checkPostingrId = await this.postingRepository.checkPostingId(
      postingId,
    );

    if (!checkPostingrId)
      throw new HttpException('posting table에 id가 없습니다', 404);

    const allCheck = await this.postingLikeRepository.allCheck(
      userId,
      postingId,
    );

    if (!allCheck) {
      await this.postingLikeRepository.createPostingLike(userId, postingId);
      return { success: true, message: 'posting like ON' };
    }
    if (allCheck) {
      this.postingLikeRepository.deletePostingLike(userId, postingId);
      return { success: true, message: 'posting like OFF' };
    }
  }
}
