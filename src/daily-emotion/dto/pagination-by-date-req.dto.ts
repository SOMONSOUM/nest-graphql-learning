import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min, IsDate } from 'class-validator';

@ArgsType()
export class PaginationByDateReqDTO {
  @Field(() => Date, {
    nullable: true,
    defaultValue: new Date(new Date().toLocaleDateString('ko-KR')),
  })
  @IsOptional()
  @IsDate()
  prevDate?: Date;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @Min(1)
  take?: number;
}
