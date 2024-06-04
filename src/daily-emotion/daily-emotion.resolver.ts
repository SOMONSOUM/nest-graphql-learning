import { Mutation, Query, Resolver, Args, Int } from '@nestjs/graphql';
import { DailyEmotionService } from './daily-emotion.service';
import { DailyEmotion } from './entities/daily-emotion.entity';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { ChooseDailyEmoReqDTO } from './dto/choose-daily-emo-req.dto';
import { DailyEmoByDateResDTO } from './dto/daily-emo-by-date-res.dto';
import { DailyEmoResDTO } from './dto/daily-emo-res.dto';
import { DailyEmosResDTO } from './dto/daily-emos-res.dto';
import { PaginationByDateReqDTO } from './dto/pagination-by-date-req.dto';

@Resolver(() => DailyEmotion)
export class DailyEmotionResolver {
  constructor(private readonly dailyEmotionService: DailyEmotionService) {}

  @Query(() => DailyEmoResDTO)
  findMyEmotionToday(@AuthUser() user: AuthUserId): Promise<DailyEmoResDTO> {
    return this.dailyEmotionService.findMyEmotionToday(user);
  }

  @Query(() => DailyEmosResDTO)
  findFamilyEmotionsToday(
    @AuthUser() user: AuthUserId,
  ): Promise<DailyEmosResDTO> {
    return this.dailyEmotionService.findFamilyEmotionsToday(user);
  }

  @Query(() => DailyEmoByDateResDTO)
  findFamilyEmotions(
    @AuthUser() user: AuthUserId,
    @Args() paginationReqDTO: PaginationByDateReqDTO,
  ): Promise<DailyEmoByDateResDTO> {
    return this.dailyEmotionService.findFamilyEmotions(user, paginationReqDTO);
  }

  @Mutation(() => BaseResponseDTO, {
    description: 'insert, update 모두 진행. Arg로 id 입력시 update.',
  })
  chooseEmotion(
    @AuthUser() user: AuthUserId,
    @Args() chooseDailyEmoReqDTO: ChooseDailyEmoReqDTO,
  ): Promise<BaseResponseDTO> {
    return this.dailyEmotionService.chooseEmotion(user, chooseDailyEmoReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  deleteEmotion(@AuthUser() user: AuthUserId): Promise<BaseResponseDTO> {
    return this.dailyEmotionService.deleteEmotion(user);
  }

  @Mutation(() => BaseResponseDTO)
  pokeFamilyEmotion(
    @AuthUser() user: AuthUserId,
    @Args('targetId', { type: () => Int }) targetId: number,
  ): Promise<BaseResponseDTO> {
    return this.dailyEmotionService.pokeFamilyEmotion(user, targetId);
  }
}
