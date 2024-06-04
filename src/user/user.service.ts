import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { User } from './entities/user.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from './constants/user-status.enum';
import { DataSource, Repository } from 'typeorm';
import { UserAuth } from './entities/user-auth.entity';
import { UserResDTO } from './dto/user-res.dto';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { EditUserReqDTO } from './dto/edit-user-req.dto';
import { RefreshTokenReqDTO } from './dto/refresh-token-req.dto';
import { SignInReqDTO } from './dto/sign-in-req.dto';
import { SignInResDTO } from './dto/sign-in-res.dto';
import { SignUpReqDTO } from './dto/sign-up-req.dto';
import { AuthService } from 'src/auth/auth.service';
import { TOKEN_TYPE } from 'src/auth/constants/token-type.enum';
import { AuthProvider } from './constants/auth-provider.enum';
import { FamilyService } from 'src/family/family.service';
import { SignInRejectType } from './constants/sign-in-reject-type.enum';
import { FamilyPediaService } from 'src/family-pedia/family-pedia.service';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly familyService: FamilyService,
    private readonly pediaService: FamilyPediaService,
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
  ) {}

  async findMyProfile({ userId }: AuthUserId): Promise<UserResDTO> {
    try {
      const user = await this.userRepository
        .createQueryBuilder()
        .select()
        .where('id = :userId', { userId })
        .andWhere('status = :status', { status: UserStatus.ACTIVE })
        .getOneOrFail();

      return { result: true, user };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  /**
   * v2. Sign In 역할까지 한 번에 (issue jwt)
   */
  async signUp(signUpReqDTO: SignUpReqDTO): Promise<SignInResDTO> {
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const {
        email,
        birthday,
        position,
        familyToken,
        userName,
        provider,
        mktPushAgreed,
        token,
        nonce,
        isBirthLunar,
      } = signUpReqDTO;

      let familyIdToJoin: number;
      const birthdayStr = `${birthday.slice(0, 4)}-${birthday.slice(4, 6)}-${birthday.slice(6)}`;

      // handle family
      if (familyToken) {
        // verify familyToken (to join family)
        const tokenVerified = await this.authService.decrypt({
          target: familyToken,
        });
        familyIdToJoin = parseInt(tokenVerified);
      } else {
        // create new family if needed
        const { result, id } = await this.familyService.createFamily();

        if (result) familyIdToJoin = id;
        else throw new Error('Cannot create new Family (from FamilyService).');
      }

      // token verify
      let authInfo: { email: string; id?: string };
      switch (provider) {
        case AuthProvider.KAKAO:
          authInfo = await this.authService.kakaoLogin(token);
          break;

        case AuthProvider.NAVER:
          authInfo = await this.authService.naverLogin(token);
          break;

        case AuthProvider.APPLE:
          authInfo = await this.authService.appleLogin(token, nonce);
          break;

        default:
          break;
      }

      // create user
      const userResult = await this.userRepository
        .createQueryBuilder('user')
        .insert()
        .into(User)
        .values({
          email,
          userName,
          provider,
          position,
          mktPushAgreed,
          isBirthLunar,
          birthday: new Date(birthdayStr),
          family: { id: familyIdToJoin },
        })
        .updateEntity(false)
        .execute();

      const userId = userResult.raw?.insertId;

      // issue JWT
      const { accessToken, refreshToken } = await this.issueTokenAndUpdate(
        userId,
        familyIdToJoin,
      );

      // create userAuth
      await this.userAuthRepository
        .createQueryBuilder('userAuth')
        .insert()
        .into(UserAuth)
        .values({
          user: { id: userId },
          refreshToken,
          ...(authInfo?.id && { providerId: authInfo.id }),
        })
        .updateEntity(false)
        .execute();

      // create family pedia service
      await this.pediaService.createFamilyPedia({ ownerId: userId });

      await queryRunner.commitTransaction();

      return { result: true, accessToken, refreshToken };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return { result: false, error: e.message };
    } finally {
      queryRunner.release();
    }
  }

  /**
   * REST API의 PUT처럼 req body에 들어 오는 것으로 전부 교체
   */
  async editUser(
    { userId }: AuthUserId,
    { userName, birthday, isBirthLunar, position }: EditUserReqDTO,
  ): Promise<BaseResponseDTO> {
    try {
      const birthdayStr = `${birthday.slice(0, 4)}-${birthday.slice(4, 6)}-${birthday.slice(6)}`;

      const updateResult = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .where('id = :userId', { userId })
        .set({
          userName,
          position,
          isBirthLunar,
          birthday: new Date(birthdayStr),
        })
        .updateEntity(false)
        .execute();

      if (updateResult?.affected !== 1) {
        throw new Error('Cannot update the user with request body.');
      }

      return { result: true };
    } catch (e) {
      return { result: false, error: e.message };
    }
  }

  async signIn({
    provider,
    token,
    nonce,
  }: SignInReqDTO): Promise<SignInResDTO> {
    try {
      let authInfo: { email: string; id?: string };
      switch (provider) {
        case AuthProvider.KAKAO:
          authInfo = await this.authService.kakaoLogin(token);
          break;

        case AuthProvider.NAVER:
          authInfo = await this.authService.naverLogin(token);
          break;

        case AuthProvider.APPLE:
          authInfo = await this.authService.appleLogin(token, nonce);
          break;

        default:
          break;
      }

      const user = await this.userRepository
        .createQueryBuilder('user')
        .select()
        .where('email = :email', { email: authInfo.email })
        .getOne();

      if (!user) {
        return {
          result: false,
          rejectType: SignInRejectType.SIGN_UP_REQUIRED,
          error: 'Sign up required. Redirection to sign up needed.',
        };
      }

      if (user.status !== UserStatus.ACTIVE) {
        return {
          result: false,
          rejectType: SignInRejectType.INACTIVE,
          error: '로그인 할 수 없는 계정입니다.',
        };
      }

      const { accessToken, refreshToken } = await this.issueTokenAndUpdate(
        user.id,
        user.familyId,
      );

      return { result: true, accessToken, refreshToken };
    } catch (e) {
      return {
        result: false,
        rejectType: SignInRejectType.ETC,
        error: e.message,
      };
    }
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenReqDTO): Promise<SignInResDTO> {
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const { userId, familyId } = this.authService.verify(refreshToken);

      const userAuth = await this.userAuthRepository
        .createQueryBuilder('userAuth')
        .select()
        .leftJoin('userAuth.user', 'user', 'user.status = :status', {
          status: UserStatus.ACTIVE,
        })
        .where('userAuth.user.id = :userId', { userId })
        .getOneOrFail();

      if (userAuth.refreshToken !== refreshToken) {
        throw new UnauthorizedException(
          'Refresh Token does not match with token from DB.',
        );
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await this.issueTokenAndUpdate(userId, familyId);

      await queryRunner.commitTransaction();

      return {
        result: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return { result: false, error: e.message };
    } finally {
      queryRunner.release();
    }
  }

  /**
   * v2. 서비스 정책 변경
   * 사용자 60일 뒤 계정 hard delete 시
   * DB 단에서 onDelete Cascade 진행
   */
  async withdraw({ userId }: AuthUserId): Promise<BaseResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      // TODO: delete photo from s3 also (use method from uploadService)
      // TODO: handle dangling family (event scheduler GC처럼 동작하도록 구현)

      const userResult = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .where('id = :userId', { userId })
        .set({ status: UserStatus.DELETED })
        .updateEntity(false)
        .execute();

      if (userResult.affected !== 1) {
        throw new Error('Cannot update user status to DELETED.');
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

  async issueTokenAndUpdate(
    userId: number,
    familyId: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.authService.sign({
      userId,
      familyId,
      tokenType: TOKEN_TYPE.ACCESS,
    });

    const refreshToken = this.authService.sign({
      userId,
      familyId,
      tokenType: TOKEN_TYPE.REFRESH,
    });

    if (!accessToken || !refreshToken) {
      throw new Error('Token generation failed.');
    }

    const updateResult = await this.userAuthRepository
      .createQueryBuilder('userAuth')
      .update()
      .where('user.id = :userId', { userId })
      .set({ refreshToken })
      .updateEntity(false)
      .execute();

    if (updateResult?.affected !== 1) {
      throw new Error('Cannot update userAuth with new refresh token.');
    }

    return { accessToken, refreshToken };
  }
}
