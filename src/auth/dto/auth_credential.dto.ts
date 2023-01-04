import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class AuthCredentialDto extends PickType(User, [
  'email',
  'password',
  'username',
  'nickname',
] as const) {}
