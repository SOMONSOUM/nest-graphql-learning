import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@ArgsType()
export class AnswerQuestionReqDTO {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field()
  @IsNumber()
  pediaId: number;

  @Field()
  //   @IsNotEmpty() // 빈칸으로 바꾸기 가능하도록 구현
  @IsString()
  answer: string;
}
