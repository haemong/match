import { Injectable, HttpException } from '@nestjs/common';
import { CommentRepository } from './comment.repository/comments.repository';
import { CommentRequesto } from './DTO/comments.request.dto';
import { UserCommentRepository } from './comment.repository/userComment.repository';
import { UserRepositoty } from '../auth/auth.repository';
import { CommentsResponseDto } from './DTO/comments.response.dto';

@Injectable()
export class CommentsService {
  constructor(
    private commentRepository: CommentRepository,
    private userCommentRepository: UserCommentRepository,
    private userRepository: UserRepositoty,
  ) {}
  async createComment(
    user: { id: number; email: string },
    body: CommentRequesto,
  ): Promise<unknown> {
    const { description, post } = body;
    const userId = user.id;

    const userEmail = user.email;

    const getExistByEmail = await this.userRepository.getEmail(userEmail);

    const getExistByUserId = await this.userRepository.checkUserId(userId);

    if (!getExistByUserId) {
      new HttpException('토큰이 이상해요~ userId', 400);
    }

    if (!getExistByEmail) {
      new HttpException('토큰이 이상해요~ email', 400);
    }

    return this.commentRepository.create(description, post, userId);
  }

  async getComment(param: number): Promise<CommentsResponseDto[]> {
    if (!param) {
      throw new HttpException('path parameter 신경써주세요 숫자로~', 400);
    }

    return await this.commentRepository.getCommentByPostId(param);
    //! get 다시 해야댐 post랑 합쳐서
  }

  async updateComment(body: CommentRequesto, user, param: number) {
    const { description, post } = body;

    const commentId = param;
    const userId = user.id;
    const userEmail = user.email;

    await this.commentRepository.update(description, commentId);

    return {
      message: 'comment 수정완료',
    };
  }

  async deleteComment(param: number, user) {
    const userId = user.id;

    const commentExist = await this.commentRepository.isExistCommentById(param);

    if (!commentExist) {
      throw new HttpException('해당 comment가 존재하지 않아요', 400);
    }

    await this.commentRepository.delete(param);

    return {
      success: true,
      message: 'comment delete success',
    };
  }

  async likeComment(user, commentId) {
    const userId = user.id;

    const commentExist = await this.commentRepository.isExistCommentById(
      commentId,
    );

    if (!commentExist) {
      throw new HttpException('해당 comment가 존재하지 않아요', 400);
    }
    const allCheck = await this.userCommentRepository.allCheck(
      userId,
      commentId,
    );

    if (!allCheck) {
      return await this.userCommentRepository.createCommentLike(
        userId,
        commentId,
      );
    }
    if (allCheck) {
      return await this.userCommentRepository.deleteCommentLike(
        userId,
        commentId,
      );
    }
  }
}
