import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PhotoService } from './photo.service';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { PhotoCommentReqDTO } from './dto/photo-comment-req.dto';
import { EditPhotoReqDTO } from './dto/edit-photo-req.dto';
import { PhotosResDTO } from './dto/photos-res.dto';
import { PhotoResDTO } from './dto/photo-res.dto';
import { PhotoCommentsResDTO } from './dto/photo-comments-res.dto';
import { PaginationReqDTO } from 'src/common/dto/pagination-req.dto';
import { CreatePhotoCommentReqDTO } from './dto/create-photo-comment-req.dto';

@Resolver()
export class PhotoResolver {
  constructor(private readonly photoService: PhotoService) {}

  /**
   * TODO
   * 1. create Photo 구현
   * 2. v1의 PhotoOutput, PhotoMeta DTO 어떻게 처리할지 (현재는 그냥 Photo 사용)
   */

  /**
   * createPhoto
   * => upload module에서 연계 구현
   * (service는 photo module 것 사용)
   * (REST API mutipart/form-data)
   */

  @Mutation(() => BaseResponseDTO)
  deletePhoto(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BaseResponseDTO> {
    return this.photoService.deletePhoto(user, id);
  }

  /**
   * 운영정책 상 photo file은 수정(추가/삭제) 불가
   * 해당 기능이 필요하다면, 사용자는 게시글 삭제하고 사진 다시 선택해서 올려야
   */
  @Mutation(() => BaseResponseDTO)
  editPhoto(
    @AuthUser() user: AuthUserId,
    @Args() editPhotoReqDTO: EditPhotoReqDTO,
  ): Promise<BaseResponseDTO> {
    return this.photoService.editPhoto(user, editPhotoReqDTO);
  }

  @Query(() => PhotosResDTO)
  findPhotos(
    @AuthUser() user: AuthUserId,
    @Args() paginationReqDTO: PaginationReqDTO,
  ): Promise<PhotosResDTO> {
    return this.photoService.findPhotos(user, paginationReqDTO);
  }

  @Query(() => PhotoResDTO)
  findPhoto(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PhotoResDTO> {
    return this.photoService.findPhoto(user, id);
  }

  @Mutation(() => BaseResponseDTO)
  likePhoto(
    @AuthUser() user: AuthUserId,
    @Args('photoId', { type: () => Int }) photoId: number,
  ): Promise<BaseResponseDTO> {
    return this.photoService.likePhoto(user, photoId);
  }

  @Mutation(() => BaseResponseDTO)
  unlikePhoto(
    @AuthUser() user: AuthUserId,
    @Args('photoId', { type: () => Int }) photoId: number,
  ): Promise<BaseResponseDTO> {
    return this.photoService.unlikePhoto(user, photoId);
  }

  @Mutation(() => BaseResponseDTO)
  commentPhoto(
    @AuthUser() user: AuthUserId,
    @Args() createCommentReqDTO: CreatePhotoCommentReqDTO,
  ): Promise<BaseResponseDTO> {
    return this.photoService.commentPhoto(user, createCommentReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  deletePhotoComment(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BaseResponseDTO> {
    return this.photoService.deletePhotoComment(user, id);
  }

  @Query(() => PhotoCommentsResDTO)
  findPhotoComments(
    @AuthUser() user: AuthUserId,
    @Args() photoCommentReqDTO: PhotoCommentReqDTO,
  ): Promise<PhotoCommentsResDTO> {
    return this.photoService.findPhotoComments(user, photoCommentReqDTO);
  }
}
