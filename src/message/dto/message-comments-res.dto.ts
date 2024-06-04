import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { MessageComment } from '../entities/message-comment.entity';

@ObjectType()
export class MsgCommentsResDTO extends BaseResponseDTO {
  @Field(() => [MessageComment], { nullable: true })
  comments?: MessageComment[];
}
