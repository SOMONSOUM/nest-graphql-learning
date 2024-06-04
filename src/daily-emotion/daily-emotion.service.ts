import { Injectable } from '@nestjs/common';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { ChooseDailyEmoReqDTO } from './dto/choose-daily-emo-req.dto';
import { DailyEmoByDateResDTO } from './dto/daily-emo-by-date-res.dto';
import { DailyEmoResDTO } from './dto/daily-emo-res.dto';
import { DailyEmosResDTO } from './dto/daily-emos-res.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DailyEmotion } from './entities/daily-emotion.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserStatus } from 'src/user/constants/user-status.enum';
import { PaginationByDateReqDTO } from './dto/pagination-by-date-req.dto';
import { DailyEmoByDateDTO } from './dto/daily-emo-by-date.dto';

@Injectable()
export class DailyEmotionService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(DailyEmotion)
    private dailyEmoRepository: Repository<DailyEmotion>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findMyEmotionToday({ userId }: AuthUserId): Promise<DailyEmoResDTO> {
    const today = new Date(new Date().toLocaleDateString('ko-KR'));

    try {
      const dailyEmotion = await this.dailyEmoRepository
        .createQueryBuilder('emo')
        .select()
        .where('date = :date', { date: today })
        .andWhere('emo.user.id = :userId', { userId })
        .getOne();

      return { result: true, dailyEmotion };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async findFamilyEmotionsToday({
    userId,
    familyId,
  }: AuthUserId): Promise<DailyEmosResDTO> {
    const today = new Date(new Date().toLocaleDateString('ko-KR'));

    try {
      const dailyEmotions = await this.dailyEmoRepository
        .createQueryBuilder('emo')
        .select()
        .innerJoinAndSelect('emo.user', 'user', 'user.familyId = :familyId', {
          familyId,
        })
        .where('date = :date', { date: today })
        .orderBy('user.id', 'ASC')
        .getMany();

      // 정렬 순서: 본인 1순위 -> 이후 userId 정렬
      dailyEmotions.sort((a, b) => {
        if (a.userId === userId) return -1;
        else if (b.userId === userId) return 1;
        else return a.userId - b.userId;
      });

      return { result: true, dailyEmotions };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async findFamilyEmotions(
    { userId, familyId }: AuthUserId,
    { take, prevDate }: PaginationByDateReqDTO,
  ): Promise<DailyEmoByDateResDTO> {
    const dailyEmotionsByDate: DailyEmoByDateDTO[] = [];
    const dayInMilliSec = 1000 * 60 * 60 * 24;
    /**
     * .toLocaleDateString('ko-KR')
     * choose emotion에서 ko-KR로 변환해서 입력하기 때문에
     * prevDate를 한 번 더 한국 시간으로 변경하면 오류
     * 즉, 전달받은 prevDate는 UTC가 아닌 한국 시간일 것을 가정
     * 그럼에도 %연산으로 시간 부분 날려주는 것은 validation의 일환으로 진행
     */
    const endDate = new Date(
      new Date(prevDate.getTime() - (prevDate.getTime() % dayInMilliSec)),
    );
    const startDate = new Date(endDate.getTime() - dayInMilliSec * take); // 검색 시작일

    try {
      const dailyEmotions = await this.dailyEmoRepository
        .createQueryBuilder('emo')
        .select()
        .innerJoinAndSelect('emo.user', 'user', 'user.familyId = :familyId', {
          familyId,
        })
        .where('emo.date < :end', { end: endDate })
        .andWhere('emo.date >= :start', { start: startDate })
        .orderBy('emo.date', 'DESC')
        .getMany();

      for (const emo of dailyEmotions) {
        const idx = dailyEmotionsByDate.findIndex(
          (emoByDate) => emoByDate.date.getTime() === emo.date.getTime(),
        );

        if (idx === -1) {
          const emoByDateNew = new DailyEmoByDateDTO();
          emoByDateNew.dailyEmotions = [];

          emoByDateNew.date = emo.date;
          emoByDateNew.dailyEmotions.push(emo);

          dailyEmotionsByDate.push(emoByDateNew);
        } else {
          dailyEmotionsByDate[idx].dailyEmotions.push(emo);
        }
      }

      for (const dailyEmo of dailyEmotionsByDate) {
        dailyEmo.dailyEmotions.sort((a, b) => {
          if (a.userId === userId) return -1;
          else if (b.userId === userId) return 1;
          else a.userId - b.userId;
        });
      }

      return { result: true, dailyEmotionsByDate };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async chooseEmotion(
    { userId }: AuthUserId,
    { type }: ChooseDailyEmoReqDTO,
  ): Promise<BaseResponseDTO> {
    try {
      const today = new Date(new Date().toLocaleDateString('ko-KR'));

      const emotion = this.dailyEmoRepository.create({
        type,
        date: today,
        user: { id: userId },
      });

      // upsert 위해 query builder 대신 repo.save 사용
      await this.dailyEmoRepository.save(emotion, {
        reload: false,
        transaction: false,
      });

      // TODO: send notification

      return { result: true };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async deleteEmotion({ userId }: AuthUserId): Promise<BaseResponseDTO> {
    const today = new Date(new Date().toLocaleDateString('ko-KR'));

    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const deleteResult = await this.dailyEmoRepository
        .createQueryBuilder('emo')
        .delete()
        .from(DailyEmotion)
        .where('date = :today', { today })
        .andWhere('user.id = :userId', { userId })
        .execute();

      if (deleteResult.affected !== 1) {
        throw new Error(
          'Cannot delete the daily emotion. Might be due to invalid emotionId or unauthenticated user.',
        );
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

  async pokeFamilyEmotion(
    { familyId }: AuthUserId,
    targetId: number,
  ): Promise<BaseResponseDTO> {
    try {
      const targetUser = await this.userRepository
        .createQueryBuilder('user')
        .select()
        .where('id = :targetId', { targetId })
        .andWhere('user.family.id = :familyId', { familyId })
        .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
        .getOneOrFail();

      // TODO: send notification

      return { result: true };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }
}
