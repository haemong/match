import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from 'src/auth/dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { LoginCredentialDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoty } from './auth.repository';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepositoty: UserRepositoty,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { email, password, username, nickname } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepositoty.create({
      email,
      password: hashedPassword,
      username,
      nickname,
    });

    const getEmail = await this.userRepositoty
      .createQueryBuilder()
      .select()
      .where({ email: email })
      .getExists();

    const getNickname = await this.userRepositoty
      .createQueryBuilder()
      .select()
      .where({ nickname: nickname })
      .getExists();

    if (getEmail) throw new ConflictException('conflict email');
    if (getNickname) throw new ConflictException('conflict nickname');

    try {
      await this.userRepositoty.save(user);
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(
    loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { id, email, password } = loginCredentialDto;
    const user = await this.userRepositoty.findOneBy({ id, email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, email: user.email };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
