import { registerEnumType } from '@nestjs/graphql';

export enum LinkableService {
  NONE = 'none',
  LETTER = 'letter',
  PHOTO = 'photo',
  PEDIA = 'pedia',
}

registerEnumType(LinkableService, { name: 'LinkableService' });
