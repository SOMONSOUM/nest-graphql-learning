import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { FamilyPedia } from '../entities/family-pedia.entity';

@ObjectType()
export class FamilyPediasResDTO extends BaseResponseDTO {
  @Field(() => [FamilyPedia], { nullable: true })
  familyPedias?: FamilyPedia[];
}
