import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posting } from './posting.entity';

@Entity({ schema: 'match', name: 'categories' })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'id',
    type: 'number',
  })
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name',
    type: 'string',
  })
  name: string;

  @OneToMany((_type) => Posting, (posting) => posting.category, {
    cascade: true,
  })
  postings: Posting[];
}
