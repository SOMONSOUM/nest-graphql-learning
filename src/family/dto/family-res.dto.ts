import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { Family } from '../entities/family.entity';

@ObjectType()
export class FamilyResDTO extends BaseResponseDTO {
  @Field(() => Family, { nullable: true })
  family?: Family;
}
