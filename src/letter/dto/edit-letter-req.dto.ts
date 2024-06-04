import { ArgsType, Field, Int, PickType } from '@nestjs/graphql';
import { SendLetterReqDTO } from './send-letter-req.dto';
import { IsNumber } from 'class-validator';

@ArgsType()
export class EditLetterReqDTO extends PickType(SendLetterReqDTO, [
  'title',
  'emotion',
  'isTemp',
  'isTimeCapsule',
  'payload',
  'receiveDate',
]) {
  @Field(() => Int)
  @IsNumber()
  id: number;
}
