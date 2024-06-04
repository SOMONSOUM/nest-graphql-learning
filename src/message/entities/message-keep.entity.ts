import { Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/user/entities/user.entity';
import { MessageFamily } from './message-family.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'message_family_keep' })
@ObjectType()
export class MessageKeep extends CoreEntity {
  /**
   * Message Keep는 사용자당 한 번만 좋아요 가능
   * Core Entity 상속하지 않고
   * userId, messageFamilyId 복합키 + createdAt만 추가 정도로 구현하는 게 나을 듯
   * 그럼에도 prod 환경의 db를 수정할 만큼의 중대한 차이는 아닌 것으로 보이기에
   * 일단 수정하지는 않고 주석만 남겨 둠
   * */

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => MessageFamily, (msgFam) => msgFam.keeps, {
    onDelete: 'CASCADE',
  })
  @Field(() => MessageFamily)
  message: MessageFamily;
}
