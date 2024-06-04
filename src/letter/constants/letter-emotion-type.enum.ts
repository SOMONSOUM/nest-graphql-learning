import { registerEnumType } from '@nestjs/graphql';

export enum LetterEmotionType {
  HAPPY = 'happy',
  PASSION = 'passion',
  COMFORT = 'comfort',
  TIRED = 'tired',
  SAD = 'sad',
  SHARP = 'sharp',
}

registerEnumType(LetterEmotionType, { name: 'LetterEmotion' });
