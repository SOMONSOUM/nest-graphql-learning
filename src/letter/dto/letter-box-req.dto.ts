import { ArgsType, Field } from '@nestjs/graphql';
import { LetterType } from '../constants/letter-type.enum';
import { IsEnum } from 'class-validator';
import { PaginationReqDTO } from 'src/common/dto/pagination-req.dto';
import { LetterBoxType } from '../constants/letter-box-type.enum';

@ArgsType()
export class LetterBoxReqDTO extends PaginationReqDTO {
  @Field(() => LetterType)
  @IsEnum(LetterType)
  type: LetterType;

  @Field(() => LetterBoxType, {
    nullable: true,
    defaultValue: LetterBoxType.ALL,
  })
  @IsEnum(LetterBoxType)
  boxType: LetterBoxType;
}
