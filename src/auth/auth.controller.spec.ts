import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { AuthCredentialDto } from './dto/auth_credential.dto';
import { LoginCredentialDto } from './dto/login.dto';

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

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockImplementation(() => {
              return Promise.resolve(signUpRes);
            }),
            signIn: jest.fn().mockImplementation(() => {
              return Promise.resolve(signInRes);
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp()', () => {
    it('should be called authService(signUp))', () => {
      expect(authController.signUp(signUpReq)).resolves.toEqual(signUpRes);
      expect(authService.signUp).toHaveBeenCalledWith(signUpReq);
    });
  });

  describe('signIn()', () => {
    it('should be called authService(signIn)', () => {
      expect(authController.signIn(signInReq)).resolves.toEqual(signInRes);
      expect(authService.signIn).toHaveBeenCalledWith(signInReq);
    });
  });
});
