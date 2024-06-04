import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { Inquiry } from '../entities/inquiry.entity';

@ObjectType()
export class InquiriesResDTO extends BaseResponseDTO {
  @Field(() => [Inquiry], { nullable: true })
  inquiries?: Inquiry[];
}
