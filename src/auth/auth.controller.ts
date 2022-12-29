import { AuthCredentialDto } from 'src/auth/dto/auth-credential.dto';
import { AuthService } from './auth.service';
import {
  Controller,
  Body,
  Post,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { LoginCredentialDto } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { GetUser } from './get-user-decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(loginCredentialDto);
  }

  @Post('/test')
  @UseGuards(new JwtAuthGuard())
  test(@GetUser() userIde) {
    return userIde;
  }
}
