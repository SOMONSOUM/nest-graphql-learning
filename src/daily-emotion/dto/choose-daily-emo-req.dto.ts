import { IsEnum } from 'class-validator';
import { DailyEmotionType } from '../constants/daily-emotion-type.enum';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ChooseDailyEmoReqDTO {
  /**
   * 필드 하나밖에 없지만
   * 깔끔하게 class validator 사용
   * scale 가능성 높은 기능이기에 DTO 파일 별도 제작
   */

  @Field(() => DailyEmotionType)
  @IsEnum(DailyEmotionType)
  type: DailyEmotionType;
}
