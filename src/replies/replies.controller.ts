import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RepliesService } from './replies.service';
import { ReplyRequestDto } from './DTO/replies.request.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetUser } from '../auth/decorator/get_user.decorator';
import { ReplyUpdateRequestDto } from './DTO/replies.update.request.dto';
import { User } from 'src/auth/entities/user.entity';

@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async setReply(
    @GetUser() user: { id: number; email: string },
    @Body() body: ReplyRequestDto,
  ): Promise<unknown> {
    return this.repliesService.setReply(user, body);
  }

  @Get('/:commentId')
  async getReply(@Param('commentId') param: number): Promise<unknown> {
    return this.repliesService.getReply(param);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateReply(
    @Req() req: Request,
    @Body() body: ReplyUpdateRequestDto,
    @GetUser() user: { id: number; email: string },
  ): Promise<unknown> {
    return await this.repliesService.updateReply(req, body, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:replyId')
  async deleteReply(@Param('replyId') param: number): Promise<unknown> {
    return await this.repliesService.deleteReply(param);
  }

  @Post('like/:id')
  async likeReply(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) replyId: number,
  ) {
    return await this.repliesService.likeReply(user, replyId);
  }
}
