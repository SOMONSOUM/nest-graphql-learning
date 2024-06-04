import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentStatus } from '../constants/comment-status.enum';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field()
  payload: string;

  // createForeignKeyConstraints: false, // 정책 상 사용자 데이터 삭제시 바로 삭제
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  author: User;

  @Column({ default: CommentStatus.ACTIVE })
  @Field(() => CommentStatus)
  status: CommentStatus;
}
