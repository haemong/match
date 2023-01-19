import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posting } from './posting.entity';

@Entity({ schema: 'match', name: 'tags' })
export class Tag extends BaseEntity {
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
    description: 'title',
    type: 'string',
  })
  title: string;

  @ManyToOne((_type) => Posting, (posting) => posting.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'posting_id' })
  posting: Posting;
}
