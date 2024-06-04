/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from '../user.resolver';
import { UserService } from '../user.service';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { EditUserReqDTO } from '../dto/edit-user-req.dto';
import { RefreshTokenReqDTO } from '../dto/refresh-token-req.dto';
import { SignInReqDTO } from '../dto/sign-in-req.dto';
import { SignUpReqDTO } from '../dto/sign-up-req.dto';
import { UserResDTO } from '../dto/user-res.dto';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { CreateResDTO } from 'src/common/dto/create-res.dto';
import { SignInResDTO } from '../dto/sign-in-res.dto';

const mockUser: AuthUserId = { userId: 1, familyId: 1 };

const mockFailResDTO: BaseResponseDTO = {
  result: false,
  error: 'Fail mocking.',
};

const userServiceMock = () => ({
  findMyProfile: jest.fn((user: AuthUserId): UserResDTO => mockFailResDTO),
  signUp: jest.fn((signUpReqDTO: SignUpReqDTO): CreateResDTO => mockFailResDTO),
  editUser: jest.fn(
    (user: AuthUserId, editUserReqDTO: EditUserReqDTO): BaseResponseDTO =>
      mockFailResDTO,
  ),
  signIn: jest.fn((signInReqDTO: SignInReqDTO): SignInResDTO => mockFailResDTO),
  refreshToken: jest.fn(
    (refreshTokenReqDTO: RefreshTokenReqDTO): SignInResDTO => mockFailResDTO,
  ),
  withdraw: jest.fn((user: AuthUserId): BaseResponseDTO => mockFailResDTO),
});

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: userServiceMock() },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('[findMyProfile] query 성공', async () => {
    const res = await resolver.findMyProfile(mockUser);
    expect(res.result).toEqual(false);
    expect(res.error).toEqual('Fail mocking.');
    expect(res.user).toBeUndefined();
  });
});
