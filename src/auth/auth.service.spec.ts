import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { AuthCredentialDto } from './dto/auth_credential.dto';
import { LoginCredentialDto } from './dto/login.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepositoty } from 'src/auth/auth.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { PassportModule } from '@nestjs/passport';
import * as bcrypt from 'bcryptjs';

const signUpReq: AuthCredentialDto = {
  email: 'unit_test1@test.com',
  password: 'unit_test_password_signUp12!@',
  username: 'unit_test_username_signUP',
  nickname: 'unit_test_nickname_nickname',
};

const signUpRes = {
  success: true,
};

const signInReq: LoginCredentialDto = {
  id: 1,
  email: 'unit_test1@test.com',
  password: 'unit_test_password_signUp12!@',
};

const signInRes = {
  accessToken: 'f23fhoifh9fhaosfiadjasdo',
  nickname: 'unit_test_response_signIn_nickname',
};

describe('CommentsService', () => {
  let authService: AuthService;
  let userRepository: UserRepositoty;
  let repoUser: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get('JWT_EXPIRES_IN'),
            },
          }),
        }),
      ],
      providers: [
        User,
        AuthService,
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
        UserRepositoty,
        JwtService,
        {
          provide: UserRepositoty,
          useValue: {
            // TODO 이곳엔 repository의 함수들을 쓰는게 아닐까?
            getEmail: jest.fn(),
            getNickname: jest.fn(),
            signUpUser: jest.fn().mockResolvedValue(signUpRes),
            findUserInfo: jest.fn().mockRejectedValue(signInReq),
            checkUserId: jest.fn(),
            getNicknameById: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(), // * 이렇게하면 가능
          // useValue: Repository<User>, // * 이렇게하면 typeorm의 create도 사용 불가능 ㄷㄷ
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepositoty>(UserRepositoty);
    repoUser = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp()', () => {
    it('signUp()', async () => {
      const repoSpy = jest.spyOn(userRepository, 'signUpUser');

      expect(await authService.signUp(signUpReq)).toEqual(signUpRes);
      expect(repoSpy).toBeCalled();
    });
  });

  describe('signIn()', () => {
    it('signIn()', async () => {
      const password = signUpReq.password;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      signUpReq.password = await hashedPassword;

      const singUpUser = repoUser.create(signUpReq);
      const saveMockRepo = await repoUser.save(singUpUser);

      saveMockRepo.username = signUpReq.username;
      saveMockRepo.nickname = signUpReq.nickname;
      saveMockRepo.password = signUpReq.password;
      saveMockRepo.email = signUpReq.email;
      saveMockRepo.id = 1;

      expect(
        bcrypt.compare(signInReq.password, saveMockRepo.password),
      ).toBeTruthy();

      const payloadMock = { id: saveMockRepo.id, email: saveMockRepo.email };
      const payload = { id: signInReq.id, email: signInReq.email };

      expect(jwtService.sign(payload)).toEqual(jwtService.sign(payloadMock));
    });
  });
});

// ! 되긴했는데 뭔 소리인지 모르겠네
