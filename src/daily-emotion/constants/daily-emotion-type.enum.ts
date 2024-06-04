import { registerEnumType } from '@nestjs/graphql';

export enum DailyEmotionType {
  happy = 'happy',
  passion = 'passion',
  comfort = 'comfort',
  tired = 'tired',
  sad = 'sad',
  sharp = 'sharp',
}

registerEnumType(DailyEmotionType, { name: 'DailyEmotionType' });
