import { Column, Entity, ManyToOne } from 'typeorm';
import { Banner } from './banner.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class BannerPayloadPlacement extends CoreEntity {
  @Column()
  @Field()
  screen: string;

  @Column()
  @Field() // 왜 string?
  order: string;

  @ManyToOne(() => Banner, (banner) => banner.placements, {
    onDelete: 'CASCADE',
  })
  @Field(() => Banner)
  banner: Banner;
}
