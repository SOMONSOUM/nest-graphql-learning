import { CoreEntity } from 'src/common/entites/core.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { BannerPayloadType } from '../constants/banner-payload-type.enum';
import { BannerType } from '../constants/banner-type.enum';
import { BannerPayloadPlacement } from './banner-payload-placement.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Banner extends CoreEntity {
  @Column()
  @Field()
  url: string;

  @Column()
  @Field(() => BannerType)
  type: BannerType;

  @Column({ nullable: true })
  @Field()
  description: string;

  @Column()
  @Field(() => BannerPayloadType)
  payloadType: BannerPayloadType;

  @Column()
  @Field({
    description: '클릭시 이동 화면 - Webview url | RN screen name(to navigate)',
  })
  payloadPath: string;

  @OneToMany(() => BannerPayloadPlacement, (place) => place.banner)
  @Field(() => [BannerPayloadPlacement])
  placements: BannerPayloadPlacement[];
}
