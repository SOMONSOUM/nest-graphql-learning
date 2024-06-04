import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { DailyEmotion } from '../entities/daily-emotion.entity';

@ObjectType()
export class DailyEmosResDTO extends BaseResponseDTO {
  @Field(() => [DailyEmotion], { nullable: true })
  dailyEmotions?: DailyEmotion[];
}
