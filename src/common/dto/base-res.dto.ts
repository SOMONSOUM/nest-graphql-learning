import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseResponseDTO {
  @Field(() => Boolean)
  result: boolean;

  @Field({ nullable: true })
  error?: string;
}
