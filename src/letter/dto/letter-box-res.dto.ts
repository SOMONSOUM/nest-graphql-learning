import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { Letter } from '../entities/letter.entity';

@ObjectType()
export class LetterBoxResDTO extends BaseResponseDTO {
  @Field(() => [Letter], { nullable: true })
  letters?: Letter[];
}
