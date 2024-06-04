import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { BannerReqDTO } from './dto/banner-req.dto';
import { BannerType } from './constants/banner-type.enum';
import { BannersResDTO } from './dto/banners-res.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner) private bannerRepository: Repository<Banner>,
  ) {}

  async findBanners({
    type,
    screenName,
  }: BannerReqDTO): Promise<BannersResDTO> {
    try {
      const query = this.bannerRepository.createQueryBuilder('banner').select();

      if (type === BannerType.BAR) {
        query.innerJoin(
          'banner.placements',
          'placements',
          'placements.screen = :screenName',
          { screenName },
        );
      }

      query
        .andWhere('banner.type = :type', { type })
        .orderBy('banner.updatedAt', 'DESC')
        .addOrderBy('banner.id', 'DESC');

      const banners = await query.getMany();

      return { result: true, banners };
    } catch (e) {}
  }
}
