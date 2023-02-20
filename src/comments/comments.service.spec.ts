import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { CommentRepository } from './comment.repository/comments.repository';
import { Comment } from './entities/comments.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepositoty } from 'src/auth/auth.repository';
import { UserCommentRepository } from './comment.repository/userComment.repository';
import { UserComment } from './entities/user_comment.entity';

describe('CommentsService', () => {
  let commentService: CommentsService;
  let commentRepository: CommentRepository;
  let commentMockRepo: Repository<Comment>;
  let userCommentRepository: UserCommentRepository;
  let userCommentMockRepo: Repository<UserComment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCommentRepository,
        UserRepositoty,
        CommentsService,
        CommentRepository,
        {
          provide: UserRepositoty,
          useValue: {
            getEmail: jest.fn(),
            checkUserId: jest.fn(),
          },
        },
        {
          provide: CommentRepository,
          useValue: {
            create: jest.fn(),
            getCommentByPostId: jest.fn(),
            update: jest.fn(),
            isExistCommentById: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: UserCommentRepository,
          useValue: {
            createCommentLike: jest.fn(),
            deleteCommentLike: jest.fn(),
          },
        },
      ],
    }).compile();

    commentService = module.get<CommentsService>(CommentsService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
    commentMockRepo = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
    userCommentRepository = module.get<UserCommentRepository>(
      UserCommentRepository,
    );
    userCommentMockRepo = module.get<Repository<UserComment>>(
      getRepositoryToken(UserComment),
    );
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  it('should be createComment()', async () => {});
  it('should be getComment()', async () => {});
  it('should be updateComment()', async () => {});
  it('should be deleteComment()', async () => {});
  it('should be likeComment()', async () => {});
});
