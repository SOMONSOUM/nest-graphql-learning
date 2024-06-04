import { registerEnumType } from '@nestjs/graphql';

export enum BannerPayloadType {
  WEBVIEW = 'webview',
  SCREEN = 'screen',
}

registerEnumType(BannerPayloadType, { name: 'BannerPayloadType' });
