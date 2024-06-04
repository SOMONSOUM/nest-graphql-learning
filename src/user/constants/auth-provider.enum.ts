import { registerEnumType } from '@nestjs/graphql';

export enum AuthProvider {
  KAKAO = 'kakao',
  NAVER = 'naver',
  APPLE = 'apple',
}

registerEnumType(AuthProvider, { name: 'AuthProvider' });
