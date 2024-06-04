import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserResDTO extends BaseResponseDTO {
  @Field(() => User, { nullable: true })
  user?: User;
}
