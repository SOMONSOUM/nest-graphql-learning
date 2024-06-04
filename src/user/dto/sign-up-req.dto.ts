import { ArgsType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthProvider } from '../constants/auth-provider.enum';
import { FamilyPosition } from '../constants/family-position.enum';

@ArgsType()
export class SignUpReqDTO {
  @Field()
  @IsEmail()
  email: string;

  @Field(() => Boolean)
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @Field()
  @IsNotEmpty()
  @IsString()
  userName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  birthday: string;

  @Field(() => Boolean)
  @IsBoolean()
  isBirthLunar: boolean;

  @Field(() => FamilyPosition)
  @IsEnum(FamilyPosition)
  position: FamilyPosition;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  familyToken?: string;

  @Field(() => Boolean)
  @IsBoolean()
  mktPushAgreed: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  token?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nonce?: string;
}
