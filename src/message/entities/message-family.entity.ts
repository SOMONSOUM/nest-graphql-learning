import { CoreEntity } from 'src/common/entites/core.entity';
import { Family } from 'src/family/entities/family.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Message } from './message.entity';
import { MessageComment } from './message-comment.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MessageKeep } from './message-keep.entity';

@Entity()
@ObjectType()
export class MessageFamily extends CoreEntity {
  /**
   * 하나의 Message 당 여러 MessageFamily를 가질 수 있도록 서비스 확장 가능
   * e.g. 1년 단위 메세지 반복
   * 따라서 composite key 고려하지 않음
   */

  @Column()
  @Field(() => Date)
  receiveDate: Date;

  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  @Field(() => Message)
  message: Message;

  @Column()
  @Field(() => Int)
  familyId: number;

  @ManyToOne(() => Family, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @Field(() => Family)
  family: Family;

  @OneToMany(() => MessageComment, (comment) => comment.message, {
    eager: false,
  })
  //   @Field(() => [MessageComment])
  comments: MessageComment[];

  @OneToMany(() => MessageKeep, (keep) => keep.message, { eager: false })
  //   @Field(() => [MessageKeep])
  keeps: MessageKeep[];

  /**
   * Entity field 아님 - computed field
   * TODO: Entity - DTO(ObjectType) 분리 고려하기
   */
  @Field(() => Boolean, { nullable: true })
  isKept?: boolean;

  @Field(() => Int, { nullable: true })
  commentsCount?: number;
}
