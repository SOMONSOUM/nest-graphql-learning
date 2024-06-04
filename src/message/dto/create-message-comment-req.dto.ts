import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ArgsType()
export class CreateMsgCommentReqDTO {
  @Field(() => Int)
  @IsNumber()
  messageFamId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  payload: string;
}
