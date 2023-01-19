import { IsArray, IsNotEmpty } from 'class-validator';

export class GetPostingByTagIdDto {
  @IsNotEmpty()
  @IsArray()
  title: string;
}
