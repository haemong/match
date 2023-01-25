import { Injectable, HttpException } from '@nestjs/common';
import { RepliesRepository } from './repositories/replies.repository';
import { ReplyRequestDto } from './DTO/replies.request.dto';
import { UserRepliesRepository } from './repositories/user_replies.repository';

@Injectable()
export class RepliesService {
  constructor(
    private replyRepository: RepliesRepository,
    private userReplyRepository: UserRepliesRepository,
  ) {}

  setReply = async (
    user: { id: number; email: string },
    body: ReplyRequestDto,
  ) => {
    const { description, comment } = body;

    const isExistUser = await this.replyRepository.getExistByEmail(user);

    if (!isExistUser) {
      throw new HttpException('해당 유저가 존재하지 않습니다', 400);
    }

    const result = await this.replyRepository.createReply(
      description,
      comment,
      user.id,
    );
    return result;
  };

  getReply = async (param: number) => {
    return this.replyRepository.getReply(param);
  };

  updateReply = async (req, body, user) => {
    const { id, description } = body;

    const isExistUser = await this.replyRepository.getExistByEmail(user);

    if (!isExistUser) {
      throw new HttpException('해당 유저가 존재하지 않습니다', 400);
    }

    return await this.replyRepository.updateReply(id, description);
  };

  deleteReply = async (param) => {
    return await this.replyRepository.deleteReply(param);
  };

  likeReply = async (user, replyId) => {
    const { id } = user;

    const checkUser = await this.userReplyRepository.checklikeReply(
      id,
      replyId,
    );

    if (!checkUser) {
      return await this.userReplyRepository.createReplyLike(id, replyId);
    }
    return await this.userReplyRepository.deleteReplyLike(id, replyId);
  };
}
