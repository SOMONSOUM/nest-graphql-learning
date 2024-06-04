import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';

@ObjectType()
export class CreateResDTO extends BaseResponseDTO {
  @Field(() => Int, { nullable: true })
  id?: number;
}
