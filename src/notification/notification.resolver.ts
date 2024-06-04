import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { PaginationReqDTO } from 'src/common/dto/pagination-req.dto';
import { NotificationResDTO } from './dto/notification-res.dto';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => NotificationResDTO, {
    description: '나의 알림 목록 찾기 (페이지네이션)',
  })
  findNotifications(
    @AuthUser() user: AuthUserId,
    @Args() paginationReqDTO: PaginationReqDTO,
  ): Promise<NotificationResDTO> {
    return this.notificationService.findNotifications(user, paginationReqDTO);
  }

  @Mutation(() => BaseResponseDTO, { description: '나의 알림 내역 1개 삭제' })
  deleteNotification(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BaseResponseDTO> {
    return this.notificationService.deleteNotification(user, id);
  }
}
