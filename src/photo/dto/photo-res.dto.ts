import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { Photo } from '../entities/photo.entity';

@ObjectType()
export class PhotoResDTO extends BaseResponseDTO {
  @Field(() => Photo, { nullable: true })
  photo?: Photo;
}
