import { AuthUser } from './../auth/decorators/auth-user.decorator';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LetterService } from './letter.service';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { SendLetterReqDTO } from './dto/send-letter-req.dto';
import { EditLetterReqDTO } from './dto/edit-letter-req.dto';
import { LetterReqDTO } from './dto/letter-req.dto';
import { LetterBoxReqDTO } from './dto/letter-box-req.dto';
import { CreateResDTO } from 'src/common/dto/create-res.dto';
import { LetterResDTO } from './dto/letter-res.dto';
import { LetterBoxResDTO } from './dto/letter-box-res.dto';
import { LetterGuideResDTO } from './dto/letter-guide-res.dto';

@Resolver()
export class LetterResolver {
  constructor(private readonly letterService: LetterService) {}

  @Mutation(() => CreateResDTO)
  sendLetter(
    @AuthUser() user: AuthUserId,
    @Args() sendLetterReqDTO: SendLetterReqDTO,
  ): Promise<CreateResDTO> {
    return this.letterService.sendLetter(user, sendLetterReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  readLetter(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BaseResponseDTO> {
    return this.letterService.readLetter(user, id);
  }

  @Mutation(() => BaseResponseDTO)
  editLetter(
    @AuthUser() user: AuthUserId,
    @Args() editLetterReqDTO: EditLetterReqDTO,
  ): Promise<BaseResponseDTO> {
    return this.letterService.editLetter(user, editLetterReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  deleteLetter(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BaseResponseDTO> {
    return this.letterService.deleteLetter(user, id);
  }

  @Query(() => LetterResDTO)
  findLetter(
    @AuthUser() user: AuthUserId,
    @Args() letterReqDTO: LetterReqDTO,
  ): Promise<LetterResDTO> {
    return this.letterService.findLetter(user, letterReqDTO);
  }

  @Query(() => LetterBoxResDTO)
  findLetterBox(
    @AuthUser() user: AuthUserId,
    @Args() letterBoxReqDTO: LetterBoxReqDTO,
  ): Promise<LetterBoxResDTO> {
    return this.letterService.findLetterBox(user, letterBoxReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  keepLetter(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BaseResponseDTO> {
    return this.letterService.keepLetter(user, id);
  }

  @Mutation(() => BaseResponseDTO)
  unkeepLetter(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BaseResponseDTO> {
    return this.letterService.unkeepLetter(user, id);
  }

  @Query(() => LetterGuideResDTO)
  getLetterGuide(): Promise<LetterGuideResDTO> {
    return this.letterService.getLetterGuide();
  }
}
