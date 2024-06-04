import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InquiryService } from './inquiry.service';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { CreateInquiryReqDTO } from './dto/create-inquiry-req.dto';
import { EditInquiryReqDTO } from './dto/edit-inquiry-req.dto';
import { InquiriesResDTO } from './dto/inquiries-res.dto';
import { InquiryResDTO } from './dto/inquiry-res.dto';
import { PaginationReqDTO } from 'src/common/dto/pagination-req.dto';
import { CreateResDTO } from 'src/common/dto/create-res.dto';

@Resolver()
export class InquiryResolver {
  constructor(private readonly inquiryService: InquiryService) {}

  @Query(() => InquiriesResDTO)
  findInquiries(
    @AuthUser() user: AuthUserId,
    @Args() paginationReqDTO: PaginationReqDTO,
  ): Promise<InquiriesResDTO> {
    return this.inquiryService.findInquiries(user, paginationReqDTO);
  }

  @Query(() => InquiryResDTO)
  findInquiry(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<InquiryResDTO> {
    return this.inquiryService.findInquiry(user, id);
  }

  @Mutation(() => CreateResDTO)
  createInquiry(
    @AuthUser() user: AuthUserId,
    @Args() createInquiryReqDTO: CreateInquiryReqDTO,
  ): Promise<CreateResDTO> {
    return this.inquiryService.createInquiry(user, createInquiryReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  editInquiry(
    @AuthUser() user: AuthUserId,
    @Args() editInquiryReqDTO: EditInquiryReqDTO,
  ): Promise<BaseResponseDTO> {
    return this.inquiryService.editInquiry(user, editInquiryReqDTO);
  }

  @Mutation(() => BaseResponseDTO)
  deleteInquiry(
    @AuthUser() user: AuthUserId,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BaseResponseDTO> {
    return this.inquiryService.deleteInquiry(user, id);
  }
}
