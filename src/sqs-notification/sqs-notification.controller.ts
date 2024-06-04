import { Public } from 'src/auth/decorators/public.decorator';
import { SqsNotificationService } from './sqs-notification.service';
import { Controller, Get } from '@nestjs/common';

@Controller('sqs-notification')
export class SqsNotificationController {
  constructor(
    private readonly sqsNotificationService: SqsNotificationService,
  ) {}

  @Public()
  @Get()
  testSQS() {
    return this.sqsNotificationService.receiveNotificationPayloadSQS();
  }
}
