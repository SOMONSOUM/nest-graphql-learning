import { registerEnumType } from '@nestjs/graphql';

export enum MessageEmotionType {
  HAPPY = 'happy',
  PASSION = 'passion',
  COMFORT = 'comfort',
  TIRED = 'tired',
  SAD = 'sad',
  SHARP = 'sharp',
}

registerEnumType(MessageEmotionType, { name: 'MessageEmotion' });
