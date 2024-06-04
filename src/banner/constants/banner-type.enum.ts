import { registerEnumType } from '@nestjs/graphql';

export enum BannerType {
  HOME = 'home',
  BAR = 'bar',
}

registerEnumType(BannerType, { name: 'BannerType' });
