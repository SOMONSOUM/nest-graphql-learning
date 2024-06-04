import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
} from 'class-validator';
import { NotificationType } from '../constants/notification-type.enum';

export class SqsNotificationProduceDTO {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsNumber()
  @Min(1) // TODO set minimum familyId
  familyId: number;

  @IsOptional()
  @IsNumber()
  senderId?: number;

  @IsOptional()
  @IsBoolean()
  save?: boolean = false; // TODO default value

  @IsOptional()
  screen?: string; // TODO screen enum (sync to React Native)

  @IsOptional()
  @IsObject()
  params?: any;
}
