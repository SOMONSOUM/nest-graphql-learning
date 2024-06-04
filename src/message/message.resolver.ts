import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { Query } from '@nestjs/graphql';
import { MsgResDTO } from './dto/message-res.dto';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { MsgCommentReqDTO } from './dto/message-comment-req.dto';
import { CreateMsgCommentReqDTO } from './dto/create-message-comment-req.dto';
import { PaginationReqDTO } from 'src/common/dto/pagination-req.dto';
import { MsgCommentsResDTO } from './dto/message-comments-res.dto';
import { MsgsResDTO } from './dto/messages-res.dto';
import { CreateResDTO } from 'src/common/dto/create-res.dto';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  /**
   * message와 messageFamily의 혼동을 피하기 위해
   * 예외적으로 Arg 선언시 id => messageFamId 사용 (DTO도 마찬가지)
   */

  @Query(() => MsgResDTO)
  findMsgLatest(@AuthUser() user: AuthUserId): Promise<MsgResDTO> {
    return this.messageService.findMsgLatest(user);
  }

  @Query(() => MsgResDTO)
  findMsg(
    @AuthUser() user: AuthUserId,
    @Args('messageFamId', { type: () => Int }) messageFamId: number,
  ): Promise<MsgResDTO> {
    return this.messageService.findMsg(user, messageFamId);
  }

  @Query(() => MsgsResDTO)
  findMsgs(
    @AuthUser() user: AuthUserId,
    @Args() paginationReqDTO: PaginationReqDTO,
  ): Promise<MsgsResDTO> {
    return this.messageService.findMsgs(user, paginationReqDTO);
  }

  /** keep 관련 */

  @Query(() => MsgsResDTO)
  findMsgsKept(
    @AuthUser() user: AuthUserId,
    @Args() paginationReqDTO: PaginationReqDTO,
  ): Promise<MsgsResDTO> {
    return this.messageService.findMsgsKept(user, paginationReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  keepMsg(
    @AuthUser() user: AuthUserId,
    @Args('messageFamId', { type: () => Int }) messageFamId: number,
  ): Promise<BaseResponseDTO> {
    return this.messageService.keepMsg(user, messageFamId);
  }

  @Mutation(() => BaseResponseDTO)
  unkeepMsg(
    @AuthUser() user: AuthUserId,
    @Args('messageFamId', { type: () => Int }) messageFamId: number,
  ): Promise<BaseResponseDTO> {
    return this.messageService.unkeepMsg(user, messageFamId);
  }

  /** comment 관련 */

  @Query(() => MsgCommentsResDTO)
  findMsgComments(
    @AuthUser() user: AuthUserId,
    @Args() msgCommentReqDTO: MsgCommentReqDTO,
  ): Promise<MsgCommentsResDTO> {
    return this.messageService.findMsgComments(user, msgCommentReqDTO);
  }

  @Mutation(() => CreateResDTO)
  createMsgComment(
    @AuthUser() user: AuthUserId,
    @Args() createMsgCommentReqDTO: CreateMsgCommentReqDTO,
  ): Promise<CreateResDTO> {
    return this.messageService.createMsgComment(user, createMsgCommentReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  deleteMsgComment(
    @AuthUser() user: AuthUserId,
    @Args('commentId', { type: () => Int }) commentId: number,
  ): Promise<BaseResponseDTO> {
    return this.messageService.deleteMsgComment(user, commentId);
  }
}
