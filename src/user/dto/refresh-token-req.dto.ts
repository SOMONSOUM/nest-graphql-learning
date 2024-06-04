import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class RefreshTokenReqDTO {
  @Field()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
