import { IsNotEmpty, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class LoginCredentialDto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
