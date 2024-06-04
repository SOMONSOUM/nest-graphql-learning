import { Args, Query, Resolver } from '@nestjs/graphql';
import { BannerService } from './banner.service';
import { BannerReqDTO } from './dto/banner-req.dto';
import { BannersResDTO } from './dto/banners-res.dto';

@Resolver()
export class BannerResolver {
  constructor(private readonly bannerService: BannerService) {}

  @Query(() => BannersResDTO)
  findBanners(@Args() bannerReqDTO: BannerReqDTO): Promise<BannersResDTO> {
    return this.bannerService.findBanners(bannerReqDTO);
  }
}
