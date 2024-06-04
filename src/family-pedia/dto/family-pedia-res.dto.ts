import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { FamilyPedia } from '../entities/family-pedia.entity';

@ObjectType()
export class FamilyPediaResDTO extends BaseResponseDTO {
  @Field(() => FamilyPedia, { nullable: true })
  familyPedia?: FamilyPedia;
}
