import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { Photo } from '../entities/photo.entity';

@ObjectType()
export class PhotosResDTO extends BaseResponseDTO {
  @Field(() => [Photo], { nullable: true })
  photos?: Photo[];
}
