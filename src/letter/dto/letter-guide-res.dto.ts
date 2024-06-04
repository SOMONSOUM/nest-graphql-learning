import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { LetterGuide } from '../entities/letter-guide.entity';

@ObjectType()
export class LetterGuideResDTO extends BaseResponseDTO {
  @Field(() => LetterGuide, { nullable: true })
  letterGuide?: LetterGuide;
}
