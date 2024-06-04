import { registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
  DELETED = 'deleted',
  HIDDEN = 'hidden',
  ACTIVE = 'active',
}

registerEnumType(UserStatus, { name: 'UserStatus' });
