import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Notification {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @IsNotEmpty()
  @Field()
  title: string;

  @Column()
  @IsNotEmpty()
  @Field()
  body: string;

  // TODO: enum
  @Column({ nullable: true })
  @Field({ nullable: true })
  screen?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  param?: string;

  @ManyToOne(() => User, {
    createForeignKeyConstraints: false,
  })
  @Field(() => User)
  receiver: User;
}

/** 알림은 30일간 보존 (mysql에 직접 쿼리 보내야)
 * create event notification_clear
 * on schedule every 1 day
 * -- starts '2023-01-24 00:00:00'
 * on completion preserve
 * comment '알림 삭제'
 * do
 * 	delete from notification
 *     where datediff(now(), createdAt) > 29;
 */
