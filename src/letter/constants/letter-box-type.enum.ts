import { registerEnumType } from '@nestjs/graphql';

export enum LetterBoxType {
  ALL = 'all',
  TIME_CAPSULE = 'timeCapsule',
  KEPT = 'kept',
}

registerEnumType(LetterBoxType, { name: 'LetterBoxType' });
