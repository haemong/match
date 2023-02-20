import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from 'src/comments/comments.service';

describe('CommentsController', () => {
  let commentController: CommentsController;
  let commentService: CommentsService;

  const commentCreateRes = {
    success: true,
    message: 'Write Comment complete',
  };

  const commentUpdateRes = {
    message: 'comment 수정완료',
  };

  const commentDeleteRes = {
    success: true,
    message: 'comment delete success',
  };

  const commentGetRes = [
    {
      id: 13,
      description: '가나다테스트댓글',
      createdAt: '2023-02-10T03:19:08.187Z',
      user: {
        nickname: '오늘밤 주인공은 나야나',
      },
      userComment: [],
      reply: [],
    },
  ];

  const getUser = {
    id: 1,
    email: 'unit_test1@test.com',
  };

  const commentReq = {
    description: '가나다테스트댓글22222',
    post: 1,
  };

  const commentLikeRes = {
    success: true,
    message: 'comment delete success',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CommentsController],
      providers: [
        CommentsService,
        {
          provide: CommentsService,
          useValue: {
            createComment: jest.fn().mockResolvedValue(commentCreateRes),
            getComment: jest.fn().mockResolvedValue(commentGetRes),
            updateComment: jest.fn().mockResolvedValue(commentUpdateRes),
            deleteComment: jest.fn().mockResolvedValue(commentDeleteRes),
            likeComment: jest.fn().mockResolvedValue(commentLikeRes),
          },
        },
      ],
    }).compile();

    commentController = module.get<CommentsController>(CommentsController);
    commentService = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(commentController).toBeDefined();
  });

  describe('Comment()', () => {
    it('should make comment', async () => {
      const serviceSpy = jest.spyOn(commentService, 'createComment');
      expect(await commentController.setComment(getUser, commentReq)).toEqual(
        commentCreateRes,
      );
      expect(serviceSpy).toBeCalledWith(getUser, commentReq);
    });
    it('should get comment', async () => {
      const serviceSpy = jest.spyOn(commentService, 'getComment');

      expect(await commentController.getComment(1)).toEqual(commentGetRes);
      expect(serviceSpy).toHaveBeenCalledWith(1);
    });
    it('should update comment', async () => {
      const serviceSpy = jest.spyOn(commentService, 'updateComment');

      expect(
        await commentController.updateComment(commentReq, getUser, 1),
      ).toEqual(commentUpdateRes);
      expect(serviceSpy).toHaveBeenCalledWith(commentReq, getUser, 1);
    });
    it('should delete comment', async () => {
      const serviceSpy = jest.spyOn(commentService, 'deleteComment');

      expect(await commentController.deleteComment(getUser, 1)).toEqual(
        commentDeleteRes,
      );
      expect(serviceSpy).toBeCalledWith(1, getUser);
    });
    it('should like comment', async () => {
      expect(await commentController.likeComment(getUser, 1)).toEqual(
        commentLikeRes,
      );
      const serviceSpy = jest.spyOn(commentService, 'likeComment');
      expect(serviceSpy).toBeCalledWith(getUser, 1);
    });
  });
});
