import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ArgsType()
export class CreateQuestionReqDTO {
  @Field()
  @IsNumber()
  pediaId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  question: string;
}
