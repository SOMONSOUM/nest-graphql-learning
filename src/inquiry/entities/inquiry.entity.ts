import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'user_inquiry' })
@ObjectType()
export class Inquiry extends CoreEntity {
  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  payload: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isReplied: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  reply?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  replyDate?: Date;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @Field(() => User)
  author: User;
}
