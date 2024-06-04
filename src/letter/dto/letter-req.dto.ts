import { ArgsType, Field, Int } from '@nestjs/graphql';
import { LetterType } from '../constants/letter-type.enum';
import { IsEnum, IsNumber } from 'class-validator';

@ArgsType()
export class LetterReqDTO {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field(() => LetterType)
  @IsEnum(LetterType)
  type: LetterType;
}
