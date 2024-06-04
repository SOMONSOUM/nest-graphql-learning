import { Injectable } from '@nestjs/common';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { PaginationReqDTO } from 'src/common/dto/pagination-req.dto';
import { EditPhotoReqDTO } from './dto/edit-photo-req.dto';
import { PhotoCommentReqDTO } from './dto/photo-comment-req.dto';
import { PhotoCommentsResDTO } from './dto/photo-comments-res.dto';
import { PhotoResDTO } from './dto/photo-res.dto';
import { PhotosResDTO } from './dto/photos-res.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PhotoComment } from './entities/photo-comment.entity';
import { PhotoFile } from './entities/photo-file.entity';
import { PhotoLike } from './entities/photo-like.entity';
import { Photo } from './entities/photo.entity';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { CreateResDTO } from 'src/common/dto/create-res.dto';
import { CreatePhotoCommentReqDTO } from './dto/create-photo-comment-req.dto';
import { CommentStatus } from 'src/common/constants/comment-status.enum';

@Injectable()
export class PhotoService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    @InjectRepository(PhotoFile) private fileRespository: Repository<PhotoFile>,
    @InjectRepository(PhotoLike) private likeRepository: Repository<PhotoLike>,
    @InjectRepository(PhotoComment)
    private commentRepository: Repository<PhotoComment>,
  ) {}

  async deletePhoto(
    { userId, familyId }: AuthUserId,
    id: number,
  ): Promise<BaseResponseDTO> {
    try {
      // TODO: handle S3 photo files
      // TODO: delete comments

      const deleteResult = await this.photoRepository
        .createQueryBuilder('photo')
        .delete()
        .from(Photo)
        .where('photo.id = :id', { id })
        .andWhere('photo.author.id = :userId', { userId })
        .andWhere('photo.family.id = :familyId', { familyId })
        .execute();

      // photo file은 onDelete Cascade 적용됨

      if (deleteResult.affected !== 1) {
        throw new Error('Cannot delete the photo.');
      }

      return { result: true };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  /**
   * 운영정책 상 photo file은 수정(추가/삭제) 불가
   * 해당 기능이 필요하다면, 사용자는 게시글 삭제하고 사진 다시 선택해서 올려야
   */

  async editPhoto(
    { userId, familyId }: AuthUserId,
    { id, title, payload }: EditPhotoReqDTO,
  ): Promise<BaseResponseDTO> {
    try {
      const updateResult = await this.photoRepository
        .createQueryBuilder('photo')
        .update()
        .where('photo.id = :id', { id })
        .andWhere('photo.user.id = :userId', { userId })
        .andWhere('photo.family.id = :familyId', { familyId })
        .set({ title, payload })
        .updateEntity(false)
        .execute();

      if (updateResult.affected !== 1) {
        throw new Error('Cannot edit the photo.');
      }

      return { result: true };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async findPhotos(
    { familyId }: AuthUserId,
    { prev, take }: PaginationReqDTO,
  ): Promise<PhotosResDTO> {
    try {
      const photos = await this.photoRepository
        .createQueryBuilder('photo')
        .select()
        .addSelect('file.url')
        .innerJoinAndSelect(
          'photo.author',
          'author',
          'author.famiyId = :familyId',
          { familyId },
        )
        .innerJoinAndSelect('photo.files', 'file')
        .orderBy('photo.createdAt', 'DESC')
        .offset(prev * take)
        .limit(take)
        .getMany();

      photos.forEach((photo) => {
        photo.filesCount = photo.files.length;
        photo.thumbnailUrl = photo.files[0].url;
      });

      return { result: true, photos };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async findPhoto(
    { userId, familyId }: AuthUserId,
    id: number,
  ): Promise<PhotoResDTO> {
    try {
      // TODO: join 너무 많아 + comment도 내부적으로 join이 한 번 더 필요

      const photo = await this.photoRepository
        .createQueryBuilder('photo')
        .select()
        .addSelect('like.id')
        .addSelect('comment.id')
        .innerJoinAndSelect('photo.author', 'author')
        .innerJoinAndSelect('photo.files', 'file')
        .leftJoin('photo.comments', 'comment')
        .leftJoin('photo.likes', 'like', 'like.user.id = :userId', { userId })
        .where('photo.id = :id', { id })
        .andWhere('photo.family.id = :familyId', { familyId })
        .getOneOrFail();

      photo.isLiked = Boolean(photo.likes.length);
      photo.commentsCount = photo.comments.length;
      photo.filesCount = photo.files.length;

      return { result: true };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async likePhoto(
    { userId, familyId }: AuthUserId,
    photoId: number,
  ): Promise<BaseResponseDTO> {
    try {
      const likeExist = await this.likeRepository
        .createQueryBuilder('like')
        .select()
        .innerJoin('like.photo', 'photo', 'photo.familyId = :familyId', {
          familyId,
        }) // this.photoFamValdiate 쿼리문 통합
        .where('like.photo.id = :photoId', { photoId })
        .andWhere('like.user.id = :userId', { userId })
        .getExists();

      if (likeExist) {
        throw new Error('Already liked the photo.');
      }

      await this.likeRepository
        .createQueryBuilder('like')
        .insert()
        .into(PhotoLike)
        .values({ user: { id: userId }, photo: { id: photoId } })
        .updateEntity(false)
        .execute();

      return { result: true };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async unlikePhoto(
    { userId }: AuthUserId,
    photoId: number,
  ): Promise<BaseResponseDTO> {
    try {
      const deleteResult = await this.likeRepository
        .createQueryBuilder('like')
        .delete()
        .from(PhotoLike)
        .where('like.user.id = :userId', { userId })
        .andWhere('like.photo.id = :photoId', { photoId })
        .execute();

      if (deleteResult.affected !== 1) {
        throw new Error('Cannot delete the like.');
      }
      return { result: true };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async commentPhoto(
    { userId, familyId }: AuthUserId,
    { photoId, payload }: CreatePhotoCommentReqDTO,
  ): Promise<CreateResDTO> {
    try {
      const photoExist = await this.photoFamValidate(photoId, familyId);

      if (!photoExist) {
        throw new Error('Cannot comment on the corresponding photo.');
      }

      const insertResult = await this.commentRepository
        .createQueryBuilder('comment')
        .insert()
        .into(PhotoComment)
        .values({ author: { id: userId }, photo: { id: photoId }, payload })
        .updateEntity(false)
        .execute();

      const commentId = insertResult.raw?.insertId;

      // TODO: notification

      return { result: true, id: commentId };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  /**
   * delete comment에서는 familiy validation 하지 않음
   * 이미 작성된 댓글은 작성한 사용자에게 권한이 귀속
   */
  async deletePhotoComment(
    { userId }: AuthUserId,
    id: number,
  ): Promise<BaseResponseDTO> {
    try {
      const updateResult = await this.commentRepository
        .createQueryBuilder('comment')
        .update()
        .where('comment.id = :id', { id })
        .andWhere('comment.author.id = :userId', { userId })
        .andWhere('comment.status = :status', { status: CommentStatus.ACTIVE })
        .set({ status: CommentStatus.DELETED })
        .execute();

      if (updateResult.affected !== 1) {
        throw new Error(
          'Cannot delete the comment. (Cannot update status to deleted.)',
        );
      }

      return { result: true };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async findPhotoComments(
    { familyId }: AuthUserId,
    { photoId, prev, take }: PhotoCommentReqDTO,
  ): Promise<PhotoCommentsResDTO> {
    try {
      const photoExist = await this.photoFamValidate(photoId, familyId);

      if (!photoExist) {
        throw new Error('Cannot find the photo.');
      }

      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .select()
        .leftJoinAndSelect('comment.author', 'author')
        .where('comment.photo.id = :photoId', { photoId })
        .orderBy('createdAt', 'DESC')
        .offset(take * prev)
        .limit(take)
        .getMany();

      return { result: true, comments };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  /**
   * PhotoId와 FamilyId를 입력 받아, 해당 Photo가 해당 Family의 소유인지 확인
   * @param photoId 확인하고자 하는 Photo의 Id
   * @param familyId 해당 Photo와 매핑된 가족
   */
  async photoFamValidate(photoId: number, familyId: number): Promise<boolean> {
    const exist = await this.photoRepository
      .createQueryBuilder('photo')
      .select('photo.id')
      .where('photo.id = :photoId', { photoId })
      .andWhere('photo.familyId = :familyId', {
        familyId,
      })
      .getOne();

    return Boolean(exist);
  }
}
