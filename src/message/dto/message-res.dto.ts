import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { MessageFamily } from '../entities/message-family.entity';

@ObjectType()
export class MsgResDTO extends BaseResponseDTO {
  @Field(() => MessageFamily, { nullable: true })
  messageFam?: MessageFamily;
}
