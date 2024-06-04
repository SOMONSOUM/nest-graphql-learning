import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { DailyEmoByDateDTO } from './daily-emo-by-date.dto';

@ObjectType()
export class DailyEmoByDateResDTO extends BaseResponseDTO {
  @Field(() => [DailyEmoByDateDTO], { nullable: true })
  dailyEmotionsByDate?: DailyEmoByDateDTO[];
}
