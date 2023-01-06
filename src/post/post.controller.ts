import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CheckUser } from 'src/auth/decorator/check_user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorator/get_user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { PostingDto } from './dto/posting.dto';
import { GetPostingByTagIdDto } from './dto/getPostingByTagId.dto';
import { Posting } from './entities/posting.entity';
import { PostService } from './post.service';
import { successBoolean } from 'src/common/utils/successResponse';

@Controller('posting')
export class PostController {
  constructor(private readonly postService: PostService) {}
  //! get 전체 orderBy 없을경우 예외처리 필요
  @Get('/all')
  async getAllPosting(
    @CheckUser() user: User,
    @Query('orderBy') order: string,
  ): Promise<Posting[]> {
    return await this.postService.getAllPosting(user, order);
  }

  @Get('user/:id')
  async getPostingByUserId(
    @CheckUser() user: User,
    @Param('id', ParseIntPipe) userId: string,
    @Query('orderBy') order: string,
  ): Promise<Posting[]> {
    return await this.postService.getPostingByUserId(user, userId, order);
  }

  @Get('posting/:id')
  async getPostingByPostingId(
    @CheckUser() user: User,
    @Param('id', ParseIntPipe) postingId: string,
    @Query('orderBy') order: string,
  ): Promise<Posting[]> {
    return await this.postService.getPostingByPostingId(user, postingId, order);
  }

  @Get('tag')
  async getPostingByTagId(
    @CheckUser() user: User,
    @Query('orderBy') order: string,
    @Body()
    getPostingByTagIdDto: GetPostingByTagIdDto,
  ): Promise<any> {
    return await this.postService.getPostingByTagId(
      user,
      getPostingByTagIdDto,
      order,
    );
  }

  @Post('/create')
  @UseGuards(new JwtAuthGuard())
  @UseInterceptors(FilesInterceptor('files', 10))
  async createPosting(
    @GetUser() user: User,
    @UploadedFiles()
    files: Express.MulterS3.File,
    @Body()
    postingDto: PostingDto,
  ): Promise<successBoolean> {
    return await this.postService.createPosting(user, postingDto, files);
  }

  @Put('/:id')
  @UseGuards(new JwtAuthGuard())
  @UseInterceptors(FilesInterceptor('files', 10))
  async updatePosting(
    @GetUser() user: User,
    @UploadedFiles()
    files: Express.MulterS3.File,
    @Param('id', ParseIntPipe) postingId: string,
    @Body()
    postingDto: PostingDto,
  ): Promise<successBoolean> {
    return await this.postService.updatePosting(
      user,
      postingId,
      postingDto,
      files,
    );
  }

  @Delete('/:id')
  @UseGuards(new JwtAuthGuard())
  async deletePosting(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) postingId: string,
  ): Promise<successBoolean> {
    return await this.postService.deletePosting(user, postingId);
  }

  @Post('like/:id')
  @UseGuards(new JwtAuthGuard())
  async likePosting(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) postingId: string,
  ): Promise<successBoolean> {
    return await this.postService.likePosting(user, postingId);
  }
}
