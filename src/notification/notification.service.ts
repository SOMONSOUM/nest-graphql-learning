import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateNotificationReqDTO } from './dto/create-notification-req.dto';
import { CustomValidate } from 'src/common/utils/custom-validate.decorator';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { PaginationReqDTO } from 'src/common/dto/pagination-req.dto';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { NotificationResDTO } from './dto/notification-res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  @OnEvent('sqs.notification.payload.received')
  @CustomValidate(CreateNotificationReqDTO)
  private async handleNotificationStore(
    notifList: CreateNotificationReqDTO[],
  ): Promise<void> {
    try {
      const insertValues: QueryDeepPartialEntity<Notification>[] = [];

      for (const notif of notifList) {
        const { title, body, screen, param, receiverId } = notif;

        insertValues.push({
          title,
          body,
          receiver: { id: receiverId },
          ...(screen && {
            screen,
            ...(param && { param: JSON.stringify(param) }),
          }),
        });
      }

      await this.notificationRepository
        .createQueryBuilder('notif')
        .insert()
        .into(Notification)
        .values(insertValues)
        .updateEntity(false)
        .execute();
    } catch (e) {
      console.error('ERROR ', e.message);
    }
  }

  async findNotifications(
    { userId }: AuthUserId,
    { take, prev }: PaginationReqDTO,
  ): Promise<NotificationResDTO> {
    try {
      const notifs = await this.notificationRepository
        .createQueryBuilder('notif')
        .select()
        .where('notif.receiver.id = :userId', { userId })
        .orderBy('notif.createdAt', 'DESC')
        .addOrderBy('notif.id', 'DESC')
        .offset(take * prev)
        .limit(take)
        .getMany();

      return { result: true, notifications: notifs };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async deleteNotification(
    { userId }: AuthUserId,
    id: number,
  ): Promise<BaseResponseDTO> {
    try {
      const deleteResult = await this.notificationRepository
        .createQueryBuilder('notif')
        .delete()
        .from(Notification)
        .where('id = :id', { id })
        .andWhere('receiver.id = :userId', { userId })
        .execute();

      if (deleteResult.affected !== 1) {
        throw new Error('Cannot delete the notification.');
      }

      return { result: true };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }
}
