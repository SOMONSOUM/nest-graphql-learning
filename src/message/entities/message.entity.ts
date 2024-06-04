import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity } from 'typeorm';
import { LinkableService } from '../constants/message-linkable-service.enum';
import { MessageEmotionType } from '../constants/message-emotion-type.enum';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Message extends CoreEntity {
  @Column({ length: 350 })
  @Field()
  payload: string;

  @Column({ type: 'enum', enum: MessageEmotionType })
  @Field(() => MessageEmotionType)
  emotion: MessageEmotionType;

  @Column()
  @Field(() => Date)
  uploadAt: Date;

  @Column({ default: LinkableService.NONE })
  @Field(() => LinkableService)
  linkTo: LinkableService;
}
