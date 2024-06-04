import { Injectable } from '@nestjs/common';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { Family } from './entities/family.entity';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { InviteFamilyResDTO } from './dto/invite-family-res.dto';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MessageFamily } from 'src/message/entities/message-family.entity';
import { User } from 'src/user/entities/user.entity';
import { FamilyResDTO } from './dto/family-res.dto';
import { CreateResDTO } from 'src/common/dto/create-res.dto';

@Injectable()
export class FamilyService {
  constructor(
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    @InjectRepository(Family) private familyRepository: Repository<Family>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(MessageFamily)
    private messageRepository: Repository<MessageFamily>,
  ) {}

  async createFamily(): Promise<CreateResDTO> {
    // transaction start
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const insertFamily = await this.familyRepository
        .createQueryBuilder()
        .insert()
        .into(Family)
        .values({})
        .updateEntity(false)
        .execute();

      const familyId = insertFamily.raw?.insertId;

      await this.messageRepository
        .createQueryBuilder()
        .insert()
        .into(MessageFamily)
        .values({
          family: { id: familyId },
          message: { id: parseInt(process.env.DEFAULT_MESSAGE_ID) },
          receiveDate: new Date(),
        })
        .updateEntity(false)
        .execute();

      await queryRunner.commitTransaction();

      return { result: true, id: familyId };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return { result: false, error: e.message };
    } finally {
      await queryRunner.release();
    }
  }

  async findMyFamily(
    { userId, familyId }: AuthUserId,
    exceptMe: boolean,
  ): Promise<FamilyResDTO> {
    try {
      //   const myFamily = await this.familyRepository.findOneOrFail({
      //     where: {
      //       id: familyId,
      //       ...(exceptMe && { users: { id: Not(userId) } }),
      //     },
      //     relations: { users: true },
      //   });

      /**
       * repository 사용시 불필요한 distinct alias 쿼리가 발생하는 typeorm의 문제
       * 불필요하게 쿼리를 2번 보낼 필요가 없을 것으로 판단
       * => queryBuilder 통해 해결
       * (typeorm repository는 join 작업이 필요할 때 자체적으로 동작하는 사전 쿼리가 발생)
       * 그러나 query builder는 compile time에 오타 등을 잡아내지 못하는 문제...
       */
      const query = this.familyRepository
        .createQueryBuilder('family')
        .select()
        .leftJoinAndSelect('family.users', 'users')
        .where('family.id = :id', { id: familyId });

      if (exceptMe) {
        query.andWhere('users.id <> :userId', { userId });
      }

      const myFamily = await query.getOneOrFail();

      return { result: true, family: myFamily };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async joinFamily(
    { userId, familyId: familyToBeMerged }: AuthUserId,
    familyToken: string,
  ): Promise<BaseResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const tokenDecrypted = await this.authService.decrypt({
        target: familyToken,
      });

      const familyToJoin = parseInt(tokenDecrypted);

      if (familyToJoin === familyToBeMerged) {
        throw new Error('Already in the same family.');
      }

      const updateUser = await this.userRepository
        .createQueryBuilder()
        .update()
        .set({ family: { id: familyToJoin } })
        .where('id = :userId', { userId })
        .updateEntity(false)
        .execute();

      if (updateUser?.affected !== 1) {
        throw new Error('Family Join failed.');
      }

      /**
       * TODO: update userAuth.refreshToken
       * 기존에는 joinFamily 함수에서 다 했지만
       * 기능 분리 가능
       */

      /**
       * TOOD: member 없는 family 정리 로직 구현
       * 기존에는 joinFamily 함수에서 다 했지만,
       * 기능 분리 필요할 듯
       * 1안. 별도 함수
       * 2안. scheduler 사용 (Batch job mocking)
       */

      //   await queryRunner.rollbackTransaction(); // for test
      await queryRunner.commitTransaction();
      return { result: true };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return { result: false, error: e.message };
    } finally {
      queryRunner.release();
    }
  }

  async inviteFamily({ familyId }: AuthUserId): Promise<InviteFamilyResDTO> {
    try {
      const token = await this.authService.encrypt({
        target: familyId.toString(),
      });

      return { result: true, token };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }
}
