import { Field, ObjectType } from '@nestjs/graphql';
import { Notification } from '../entities/notification.entity';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';

@ObjectType()
export class NotificationResDTO extends BaseResponseDTO {
  @Field(() => [Notification], { nullable: true })
  notifications?: Notification[];
}
