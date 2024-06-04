import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { FamilyPediaQuestion } from './family-pedia-question';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class FamilyPedia extends CoreEntity {
  @Column({ default: process.env.FAMILY_PEDIA_DEFAULT_IMG })
  @Field()
  profilePhoto: string;

  // default 4:3 비율
  @Column({ default: 2000 })
  @Field(() => Int)
  profileWidth: number;

  @Column({ default: 1500 })
  @Field(() => Int)
  profileHeight: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User)
  owner: User;

  @OneToMany(() => FamilyPediaQuestion, (question) => question.familyPedia)
  @Field(() => [FamilyPediaQuestion])
  questions: FamilyPediaQuestion[];
}
