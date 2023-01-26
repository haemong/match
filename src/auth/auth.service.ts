import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialDto } from 'src/auth/dto/auth_credential.dto';
import * as bcrypt from 'bcryptjs';
import { LoginCredentialDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoty } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepositoty,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<object> {
    const { email, password, username, nickname } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const getEmail = await this.userRepository.getEmail(email);

    const getNickname = await this.userRepository.getNickname(nickname);

    if (getEmail) throw new ConflictException('conflict email');
    if (getNickname) throw new ConflictException('conflict nickname');

    return await this.userRepository.signUpUser(
      email,
      hashedPassword,
      username,
      nickname,
    );
  }

  async signIn(
    loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string; nickname: string }> {
    const { id, email, password } = loginCredentialDto;
    const user = await this.userRepository.findUserInfo(id, email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, email: user.email };
      const accessToken = await this.jwtService.sign(payload);
      const nickname = user.nickname;

      return { accessToken, nickname };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }

  async checkUserId(decodeTokenUserId: number): Promise<boolean> {
    const userId = decodeTokenUserId;

    return await this.userRepository.checkUserId(userId);
  }
}
