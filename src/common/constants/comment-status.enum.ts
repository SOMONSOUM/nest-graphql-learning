import { registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
  DELETED = 'deleted',
  HIDDEN = 'hidden',
  ACTIVE = 'active',
}

registerEnumType(CommentStatus, { name: 'CommentStatus' });
