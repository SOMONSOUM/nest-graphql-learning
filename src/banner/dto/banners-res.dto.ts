import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { Banner } from '../entities/banner.entity';

@ObjectType()
export class BannersResDTO extends BaseResponseDTO {
  @Field(() => [Banner], { nullable: true })
  banners?: Banner[];
}
