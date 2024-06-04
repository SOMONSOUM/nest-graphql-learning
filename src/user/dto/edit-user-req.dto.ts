import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FamilyPosition } from '../constants/family-position.enum';

@ArgsType()
export class EditUserReqDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  birthday: string;

  @Field(() => Boolean)
  @IsBoolean()
  isBirthLunar: boolean;

  @Field(() => FamilyPosition)
  @IsEnum(FamilyPosition)
  position: FamilyPosition;
}
