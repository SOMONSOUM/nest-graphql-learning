import { ArgsType, Field, Int } from '@nestjs/graphql';
import { CreateInquiryReqDTO } from './create-inquiry-req.dto';

/**
 * Partial type 아님
 * title, payload 항상 입력해줘야
 * REST API의 PUT 개녑
 */
@ArgsType()
export class EditInquiryReqDTO extends CreateInquiryReqDTO {
  @Field(() => Int)
  id: number;
}
