import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@ArgsType()
export class CreateFamilyPediaReqDTO {
  @Field(() => Int)
  @IsNumber()
  ownerId: number;
}
