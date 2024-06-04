import { registerEnumType } from '@nestjs/graphql';

export enum LetterType {
  SENT = 'sent',
  RECEIVED = 'received',
}

registerEnumType(LetterType, { name: 'LetterType' });
