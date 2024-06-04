import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreatePhotoReqDTO } from './create-photo-req.dto';
import { IsNumber } from 'class-validator';

@ArgsType()
export class EditPhotoReqDTO extends PartialType(CreatePhotoReqDTO) {
  @Field(() => Int)
  @IsNumber()
  id: number;
}
