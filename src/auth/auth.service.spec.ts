import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthCredentialDto } from './dto/auth_credential.dto';
import { LoginCredentialDto } from './dto/login.dto';
import {
  InjectRepository,
  TypeOrmModule,
  getRepositoryToken,
} from '@nestjs/typeorm';
import { UserRepositoty } from 'src/auth/auth.repository';
import { CommentsService } from 'src/comments/comments.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { typeORMConfig } from '../../ormconfig';

const signUpReq: AuthCredentialDto = {
  email: 'unit_test@test.com',
  password: 'unit_test_password_signUp',
  username: 'unit_test_username_signUP',
  nickname: 'unit_test_nickname_nickname',
};

const signUpRes = {
  success: true,
};

const signInReq: LoginCredentialDto = {
  id: Math.floor(Math.random() * 100),
  email: 'unit_test@test.com',
  password: 'unit_test_password_signUp',
};

const signInRes = {
  // success: true,
  // data: {
  accessToken: 'f23fhoifh9fhaosfiadjasdo',
  nickname: 'unit_test_response_signIn_nickname',
  // },
};

describe('CommentsService', () => {
  let authService: AuthService;
  let userRepository: UserRepositoty;
  // let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeORMConfig),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [
        AuthService,
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
        UserRepositoty,
        JwtService,
        {
          // provide: getRepositoryToken(User),
          // provide: Repository<User>,
          provide: UserRepositoty,
          useValue: {
            // signUp: jest.fn().mockResolvedValue(signUpRes),
            // signIn: jest.fn().mockResolvedValue(signInRes),
            // TODO 이곳엔 repository의 함수들을 쓰는게 아닐까?
            getEmail: jest.fn(),
            getNickname: jest.fn(),
            signUpUser: jest.fn().mockResolvedValue(signUpRes),
            findUserInfo: jest.fn(),
            checkUserId: jest.fn(),
            getNicknameById: jest.fn(),
          },
          // useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    // userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userRepository = module.get<UserRepositoty>(UserRepositoty);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp()', () => {
    // const protoUserRepo = UserRepositoty.prototype;
    // const repoSpy = jest
    //   .spyOn(protoUserRepo, 'signUpUser')
    //   .mockImplementation(async () => {
    //     return Promise.resolve(signUpRes);
    //   });
    it('signUp()', async () => {
      const repoSpy = jest.spyOn(userRepository, 'signUpUser');

      expect(await authService.signUp(signUpReq)).toEqual(signUpRes);
      expect(repoSpy).toBeCalled();
    });

    // expect(repoSpy).toBeCalledWith(signUpRes);
  });
});

// ! 되긴했는데 뭔 소리인지 모르겠네
