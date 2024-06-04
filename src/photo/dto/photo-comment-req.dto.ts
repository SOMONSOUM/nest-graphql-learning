import { PaginationReqDTO } from 'src/common/dto/pagination-req.dto';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@ArgsType()
export class PhotoCommentReqDTO extends PaginationReqDTO {
  @Field(() => Int)
  @IsNumber()
  photoId: number;
}
