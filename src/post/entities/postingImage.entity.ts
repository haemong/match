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

@Entity({ schema: 'match', name: 'postingImages' })
export class postingImage extends BaseEntity {
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
    description: 'imageUrl',
    type: 'string',
  })
  url: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'imageName',
    type: 'string',
  })
  name: string;

  @ManyToOne((_type) => Posting, (posting) => posting.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'posting_id' })
  posting: Posting;
}
