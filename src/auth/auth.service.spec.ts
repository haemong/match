import { MockFactory, Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthCredentialDto } from './dto/auth_credential.dto';
import { LoginCredentialDto } from './dto/login.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepositoty } from 'src/auth/auth.repository';

const signUpReq: AuthCredentialDto = {
  email: 'unit_test@test.com',
  password: 'unit_test_password_signUp',
  username: 'unit_test_username_signUP',
  nickname: 'unit_test_nickname_nickname',
};

const signUpRes = {
  success: true,
  data: { success: true },
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
  // let userRepository: Repository<User>;
  let userRepository: UserRepositoty;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            signUp: jest.fn().mockResolvedValue(signUpReq),
            signIn: jest.fn().mockResolvedValue(signInReq),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    // userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userRepository = module.get<UserRepositoty>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp()', () => {
    const repoSpy = jest.spyOn(userRepository, 'signUpUser'); // ! spyOn이 아됨
    expect(authService.signUp(signUpReq)).resolves.toEqual(signUpRes);
    expect(repoSpy).toBeCalledWith(signUpRes);
  });
});
