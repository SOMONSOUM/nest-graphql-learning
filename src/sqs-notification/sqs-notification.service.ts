import { Injectable } from '@nestjs/common';
import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  DeleteMessageBatchCommand,
  Message,
} from '@aws-sdk/client-sqs';
import { SqsNotificationProduceDTO } from './dto/sqs-notification-produce.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SqsNotificationService {
  private clientSQS: SQSClient;

  constructor(private eventEmitter: EventEmitter2) {
    // init SQS client
    this.clientSQS = new SQSClient({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
      region: process.env.DEFAULT_REGION,
    });
  }

  async sendNotificationSQS(body: SqsNotificationProduceDTO) {
    try {
      const command = new SendMessageCommand({
        DelaySeconds: 0,
        QueueUrl: process.env.AWS_SQS_NOTIFICATION_PRODUCE_URL,
        MessageBody: JSON.stringify(body),
      });

      await this.clientSQS.send(command);
    } catch (e) {
      console.error(e.message);
    }
  }

  /**
   * FIFO SQS가 아니기에 정확한 순서를 보장하지 않음
   * Queue에 여러 개의 메세지가 있어도 한 개 또는 적은 수만 반환할 수 있음
   * !!!항상 JSON data를 Message Body로 받아야!!!
   */
  async receiveNotificationPayloadSQS() {
    let messagesReceived: Message[];

    try {
      // TODO: Long Polling (scheduler와 동작 조율)
      const command = new ReceiveMessageCommand({
        MaxNumberOfMessages: 10,
        MessageAttributeNames: ['All'],
        QueueUrl: process.env.AWS_SQS_NOTIFICATION_STORE_URL,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 20,
      });

      const { Messages } = await this.clientSQS.send(command);
      messagesReceived = Messages;

      if (!messagesReceived) {
        return;
      }

      // SQS receiver와 알림 저장 비즈니스 로직을 decouple (SqsService는 여러 모듈에 inject 될 것이기 때문)
      this.eventEmitter.emit(
        'sqs.notification.payload.received',
        messagesReceived.map((message) => JSON.parse(message.Body)), // message body has to be JSON
      );

      await this.clearConsumedMessagesSQS(messagesReceived);
    } catch (e) {
      if (e instanceof SyntaxError) {
        // JSON parse를 비롯한 syntax error의 경우 queue에서 삭제 처리
        await this.clearConsumedMessagesSQS(messagesReceived);
      }
      console.error(messagesReceived, e.message);
    }
  }

  // clear queue after consume logic
  private async clearConsumedMessagesSQS(messages: Message[]): Promise<void> {
    if (messages.length === 1) {
      await this.clientSQS.send(
        new DeleteMessageCommand({
          QueueUrl: process.env.AWS_SQS_NOTIFICATION_STORE_URL,
          ReceiptHandle: messages[0].ReceiptHandle,
        }),
      );
    } else {
      await this.clientSQS.send(
        new DeleteMessageBatchCommand({
          QueueUrl: process.env.AWS_SQS_NOTIFICATION_STORE_URL,
          Entries: messages.map((message) => ({
            Id: message.MessageId,
            ReceiptHandle: message.ReceiptHandle,
          })),
        }),
      );
    }
  }
}
