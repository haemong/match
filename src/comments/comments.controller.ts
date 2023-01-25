import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CommentRequesto } from './DTO/comments.request.dto';
import { GetUser } from '../auth/decorator/get_user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/entities/user.entity';
import { CommentsResponseDto } from './DTO/comments.response.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async setComment(
    @GetUser() user: { id: number; email: string },
    @Body() body: CommentRequesto,
  ): Promise<unknown> {
    return await this.commentsService.createComment(user, body);
  }

  @Get(':postId')
  getComment(@Param('postId') param: number): Promise<CommentsResponseDto[]> {
    return this.commentsService.getComment(param);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:commentId')
  @UseInterceptors(FilesInterceptor('files', 10))
  async updateComment(
    @Body() body: CommentRequesto,
    @GetUser() user: { id: number; email: string },
    @Param('commentId') param: number,
  ): Promise<unknown> {
    return await this.commentsService.updateComment(body, user, param);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:commentId')
  async deleteComment(
    @GetUser() user: { id: number; email: string },
    @Param('commentId') param: number,
  ): Promise<unknown> {
    return await this.commentsService.deleteComment(param, user);
  }
  @Post('like/:id')
  @UseGuards(new JwtAuthGuard())
  async likeComment(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) commentId: string | number,
  ): Promise<unknown> {
    return await this.commentsService.likeComment(user, commentId);
  }
}
