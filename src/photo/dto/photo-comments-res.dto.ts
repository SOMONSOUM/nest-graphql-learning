import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { PhotoComment } from '../entities/photo-comment.entity';

@ObjectType()
export class PhotoCommentsResDTO extends BaseResponseDTO {
  @Field(() => [PhotoComment], { nullable: true })
  comments?: PhotoComment[];
}
