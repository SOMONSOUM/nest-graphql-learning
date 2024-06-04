import { Field, ObjectType } from '@nestjs/graphql';
import { DailyEmotion } from '../entities/daily-emotion.entity';

@ObjectType()
export class DailyEmoByDateDTO {
  @Field(() => Date)
  date: Date;

  @Field(() => [DailyEmotion])
  dailyEmotions: DailyEmotion[];
}
