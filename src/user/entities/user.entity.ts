import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AuthProvider } from '../constants/auth-provider.enum';
import { FamilyPosition } from '../constants/family-position.enum';
import { UserStatus } from '../constants/user-status.enum';
import { UserAuth } from './user-auth.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Family } from 'src/family/entities/family.entity';

@Entity()
@ObjectType()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ type: 'enum', enum: AuthProvider })
  @Field(() => AuthProvider)
  provider: AuthProvider;

  @Column()
  @Field()
  fcmToken: string;

  @Column()
  @Field()
  userName: string;

  @Column({ type: 'enum', enum: FamilyPosition })
  @Field(() => FamilyPosition)
  position: FamilyPosition;

  @OneToOne(() => UserAuth, (auth) => auth.user)
  @Field(() => UserAuth)
  userAuth: UserAuth;

  // @Column({
  //   default:
  //     'https://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg',
  // }) // 추후 nullable --> default profile image link
  // profileImage: string;

  @Column({ default: UserStatus.ACTIVE })
  @Field(() => UserStatus)
  status: UserStatus;

  @Column({ nullable: true })
  @Field(() => Date)
  birthday: Date;

  @Column({ default: false })
  @Field(() => Boolean)
  isBirthLunar: boolean;

  @Column()
  @Field(() => Boolean)
  mktPushAgreed: boolean;

  @Column({ name: 'familyId' })
  @Field(() => Int)
  familyId: number;

  @ManyToOne(() => Family, (family) => family.users)
  @JoinColumn({ name: 'familyId', referencedColumnName: 'id' })
  @Field(() => Family)
  family: Family;
}
