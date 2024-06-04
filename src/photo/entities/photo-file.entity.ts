import { Column, Entity, ManyToOne } from 'typeorm';
import { Photo } from './photo.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class PhotoFile extends CoreEntity {
  @Column()
  @Field()
  url: string;

  @Column()
  @Field(() => Int)
  width: number;

  @Column()
  @Field(() => Int)
  height: number;

  @ManyToOne(() => Photo, (photo) => photo.files, { onDelete: 'CASCADE' })
  @Field(() => Photo)
  photo: Photo;
}
