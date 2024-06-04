import { Entity, ManyToOne } from 'typeorm';
import { MessageFamily } from './message-family.entity';
import { CommentEntity } from 'src/common/entites/comment.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'message_family_comment' })
@ObjectType()
export class MessageComment extends CommentEntity {
  @ManyToOne(() => MessageFamily, (message) => message.comments, {
    onDelete: 'CASCADE',
  })
  @Field(() => MessageFamily)
  message: MessageFamily;
}
