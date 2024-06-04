import { registerEnumType } from '@nestjs/graphql';

export enum SignInRejectType {
  SIGN_UP_REQUIRED = 'signUp',
  INACTIVE = 'inactive',
  ETC = 'etc',
}

registerEnumType(SignInRejectType, { name: 'SignInRejectType' });
