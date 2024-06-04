import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Family extends CoreEntity {
  @OneToMany(() => User, (user) => user.family)
  @Field(() => [User])
  users: User[];

  //   @OneToMany(() => MessageFamily, (messageFamily) => messageFamily.family)
  //   messageFamily: MessageFamily[];

  //   @OneToMany(() => Photo, (photo) => photo.family)
  //   photos: Photo[];
}
