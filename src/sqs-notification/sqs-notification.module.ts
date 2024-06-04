import { Module } from '@nestjs/common';
import { SqsNotificationService } from './sqs-notification.service';
import { SqsNotificationController } from './sqs-notification.controller';

@Module({
  providers: [SqsNotificationService],
  controllers: [SqsNotificationController],
  exports: [SqsNotificationService],
})
export class SqsNotificationModule {}
