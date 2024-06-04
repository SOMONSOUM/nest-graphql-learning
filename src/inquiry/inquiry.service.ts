import { Injectable } from '@nestjs/common';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { CreateInquiryReqDTO } from './dto/create-inquiry-req.dto';
import { EditInquiryReqDTO } from './dto/edit-inquiry-req.dto';
import { InquiriesResDTO } from './dto/inquiries-res.dto';
import { InquiryResDTO } from './dto/inquiry-res.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { Repository, DataSource } from 'typeorm';
import { PaginationReqDTO } from 'src/common/dto/pagination-req.dto';
import { CreateResDTO } from 'src/common/dto/create-res.dto';

@Injectable()
export class InquiryService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Inquiry) private inquiryRepository: Repository<Inquiry>,
  ) {}

  async findInquiries(
    { userId }: AuthUserId,
    { take, prev }: PaginationReqDTO,
  ): Promise<InquiriesResDTO> {
    try {
      const inquiries = await this.inquiryRepository
        .createQueryBuilder('inquiry')
        .select()
        .where('inquiry.author.id = :userId', { userId })
        .skip(prev)
        .take(take)
        .getMany();

      return { result: true, inquiries };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async findInquiry(
    { userId }: AuthUserId,
    id: number,
  ): Promise<InquiryResDTO> {
    try {
      const inquiry = await this.inquiryRepository
        .createQueryBuilder('inquiry')
        .select()
        .where('id = :id', { id })
        .andWhere('inquiry.author.id = :userId', { userId })
        .getOneOrFail();

      return { result: true, inquiry };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async createInquiry(
    { userId }: AuthUserId,
    { title, payload }: CreateInquiryReqDTO,
  ): Promise<CreateResDTO> {
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const insertResult = await this.inquiryRepository
        .createQueryBuilder('inquiry')
        .insert()
        .into(Inquiry)
        .values({ title, payload, author: { id: userId } })
        .updateEntity(false)
        .execute();

      const inquiryId = insertResult.raw.insertId;

      await queryRunner.commitTransaction();

      return { result: true, id: inquiryId };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return { result: false, error: e.message };
    } finally {
      queryRunner.release();
    }
  }

  async editInquiry(
    { userId }: AuthUserId,
    { id, title, payload }: EditInquiryReqDTO,
  ): Promise<BaseResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const updateResult = await this.inquiryRepository
        .createQueryBuilder('inquiry')
        .update()
        .set({ title, payload })
        .where('author.id = :userId', { userId })
        .andWhere('id = :id', { id })
        .updateEntity(false)
        .execute();

      if (updateResult?.affected !== 1) {
        throw new Error('Cannot update the inquiry.');
      }

      await queryRunner.commitTransaction();

      return { result: true };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return { result: false, error: e.message };
    } finally {
      queryRunner.release();
    }
  }

  async deleteInquiry(
    { userId }: AuthUserId,
    id: number,
  ): Promise<BaseResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const deleteResult = await this.inquiryRepository
        .createQueryBuilder('inquiry')
        .delete()
        .from(Inquiry)
        .where('id = :id', { id })
        .andWhere('author.id = :userId', { userId })
        .andWhere('isReplied = :isReplied', { isReplied: false }) // 답변 완료 문의는 삭제 불가 (사실상 문의 취소의 기능)
        .execute();

      if (deleteResult?.affected !== 1) {
        throw new Error('Cannot delete the inquiry');
      }

      await queryRunner.commitTransaction();

      return { result: true };
    } catch (e) {
      await queryRunner.rollbackTransaction();

      return { result: false, error: e.message };
    } finally {
      queryRunner.release();
    }
  }
}
