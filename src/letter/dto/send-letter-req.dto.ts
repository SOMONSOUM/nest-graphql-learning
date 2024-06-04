import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDate,
} from 'class-validator';
import { LetterEmotionType } from '../constants/letter-emotion-type.enum';

@ArgsType()
export class SendLetterReqDTO {
  @Field()
  //   @IsNotEmpty() // for 임시저장
  @IsString()
  title: string;

  @Field()
  //   @IsNotEmpty() // for 임시저장
  @IsString()
  payload: string;

  @Field(() => LetterEmotionType)
  @IsEnum(LetterEmotionType)
  emotion: LetterEmotionType;

  @Field(() => Boolean)
  @IsBoolean()
  isTimeCapsule: boolean;

  @Field(() => Date)
  @IsDate() // TODO: test 해보기
  @IsOptional()
  receiveDate?: Date;

  @Field(() => Int)
  @IsNumber({}, { each: true })
  receivers: number[];

  @Field(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isTemp?: boolean;
}
