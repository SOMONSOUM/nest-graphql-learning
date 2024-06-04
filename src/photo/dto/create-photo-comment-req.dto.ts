import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ArgsType()
export class CreatePhotoCommentReqDTO {
  @Field(() => Int)
  @IsNumber()
  photoId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  payload: string;
}
