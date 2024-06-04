import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { SignInResDTO } from './dto/sign-in-res.dto';
import { RefreshTokenReqDTO } from './dto/refresh-token-req.dto';
import { SignInReqDTO } from './dto/sign-in-req.dto';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { SignUpReqDTO } from './dto/sign-up-req.dto';
import { EditUserReqDTO } from './dto/edit-user-req.dto';
import { UserResDTO } from './dto/user-res.dto';
import { CreateResDTO } from 'src/common/dto/create-res.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResDTO)
  findMyProfile(@AuthUser() user: AuthUserId): Promise<UserResDTO> {
    return this.userService.findMyProfile(user);
  }

  @Public()
  @Mutation(() => CreateResDTO)
  signUp(@Args() signUpReqDTO: SignUpReqDTO): Promise<CreateResDTO> {
    return this.userService.signUp(signUpReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  editUser(
    @AuthUser() user: AuthUserId,
    @Args() editUserReqDTO: EditUserReqDTO,
  ): Promise<BaseResponseDTO> {
    return this.userService.editUser(user, editUserReqDTO);
  }

  @Public()
  @Mutation(() => SignInResDTO)
  signIn(@Args() signInReqDTO: SignInReqDTO): Promise<SignInResDTO> {
    return this.userService.signIn(signInReqDTO);
  }

  @Public()
  @Mutation(() => SignInResDTO)
  refreshToken(
    @Args() refreshTokenReqDTO: RefreshTokenReqDTO,
  ): Promise<SignInResDTO> {
    return this.userService.refreshToken(refreshTokenReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  withdraw(@AuthUser() user: AuthUserId): Promise<BaseResponseDTO> {
    return this.userService.withdraw(user);
  }
}
