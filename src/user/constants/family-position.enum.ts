import { registerEnumType } from '@nestjs/graphql';

export enum FamilyPosition {
  GRANDPA = '할아버지',
  GRANMA = '할머니',
  DAD = '아빠',
  MOM = '엄마',
  SON = '아들',
  DAUGHTER = '딸',
}

registerEnumType(FamilyPosition, { name: 'FamilyPosition' });
