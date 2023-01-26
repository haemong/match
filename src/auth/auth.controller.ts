import { AuthCredentialDto } from 'src/auth/dto/auth_credential.dto';
import { AuthService } from './auth.service';
import {
  Controller,
  Body,
  Post,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { LoginCredentialDto } from 'src/auth/dto/login.dto';
import { SuccessInterceptor } from '../interceptors/success.interceptors';

@Controller('auth')
@UseInterceptors(SuccessInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<object> {
    return await this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string; nickname: string }> {
    return await this.authService.signIn(loginCredentialDto);
  }
}
