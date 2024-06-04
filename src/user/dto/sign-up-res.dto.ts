import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';

@ObjectType()
export class SignUpResDTO extends BaseResponseDTO {
  @Field(() => User, { nullable: true })
  user?: User;
}
