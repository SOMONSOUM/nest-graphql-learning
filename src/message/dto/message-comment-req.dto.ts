import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { PaginationReqDTO } from 'src/common/dto/pagination-req.dto';

@ArgsType()
export class MsgCommentReqDTO extends PaginationReqDTO {
  @Field(() => Int)
  @IsNumber()
  messageFamId: number;
}
