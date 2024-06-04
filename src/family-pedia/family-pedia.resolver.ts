import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FamilyPediaService } from './family-pedia.service';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { FamilyPedia } from './entities/family-pedia.entity';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { AnswerQuestionReqDTO } from './dto/answer-question-req.dto';
import { EditQuestionReqDTO } from './dto/edit-question-req.dto';
import { CreateQuestionReqDTO } from './dto/create-question-req.dto';
import { FamilyPediasResDTO } from './dto/family-pedias-res.dto';
import { FamilyPediaResDTO } from './dto/family-pedia-res.dto';
import { CreateResDTO } from 'src/common/dto/create-res.dto';

@Resolver(() => FamilyPedia)
export class FamilyPediaResolver {
  constructor(private readonly familyPediaService: FamilyPediaService) {}

  /**
   * TODO: edit profile photo
   */

  @Query(() => FamilyPediasResDTO)
  findPedias(@AuthUser() user: AuthUserId): Promise<FamilyPediasResDTO> {
    return this.familyPediaService.findPedias(user);
  }

  @Query(() => FamilyPediaResDTO)
  findPedia(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<FamilyPediaResDTO> {
    return this.familyPediaService.findPedia(user, id);
  }

  @Mutation(() => CreateResDTO)
  createQuestion(
    @AuthUser() user: AuthUserId,
    @Args() createuestionReqDTO: CreateQuestionReqDTO,
  ): Promise<CreateResDTO> {
    return this.familyPediaService.createQuestion(user, createuestionReqDTO);
  }

  // iff 아직 답장 안했을 경우
  @Mutation(() => BaseResponseDTO)
  editQuestion(
    @AuthUser() user: AuthUserId,
    @Args() editQuestionReqDTO: EditQuestionReqDTO,
  ): Promise<BaseResponseDTO> {
    return this.familyPediaService.editQuestion(user, editQuestionReqDTO);
  }

  // if 답장 안했을 경우 question 만든 사람 삭제 가능
  // if 피디아 주인이 삭제
  @Mutation(() => BaseResponseDTO)
  deleteQuestion(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BaseResponseDTO> {
    return this.familyPediaService.deleteQuestion(user, id);
  }

  // editQuestion으로 퉁칠지
  @Mutation(() => BaseResponseDTO)
  answerQuestion(
    @AuthUser() user: AuthUserId,
    @Args() answerQuestionReqDTO: AnswerQuestionReqDTO,
  ): Promise<BaseResponseDTO> {
    return this.familyPediaService.answerQuestion(user, answerQuestionReqDTO);
  }
}
