import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity } from 'typeorm';
import { LetterEmotionType } from '../constants/letter-emotion-type.enum';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class LetterGuide extends CoreEntity {
  @Column()
  @Field()
  title: string;

  @Column({ length: 1023 })
  @Field()
  payload: string;

  @Column({ type: 'enum', enum: LetterEmotionType })
  @Field(() => LetterEmotionType)
  emotion: LetterEmotionType;

  /**
   * (isPinned == true)
   * => Letter Home Screen에서 보이도록 고정된 것
   * */
  @Column({ default: false })
  @Field(() => Boolean)
  isPinned: boolean;
}

/** Letter Entity의 경량화된 버전
 *  Letter Entity를 그대로 사용할 수도 있지만
 *  기능적으로 분리되어 있기에 테이블 나눔
 *  (유지보수성 측면에서 우수하다고 판단)
 */
