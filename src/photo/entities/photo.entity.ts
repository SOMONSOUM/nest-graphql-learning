import { CoreEntity } from 'src/common/entites/core.entity';
import { Family } from 'src/family/entities/family.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PhotoComment } from './photo-comment.entity';
import { PhotoFile } from './photo-file.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PhotoLike } from './photo-like.entity';

@Entity()
@ObjectType()
export class Photo extends CoreEntity {
  @OneToMany(() => PhotoFile, (files) => files.photo)
  @Field(() => [PhotoFile])
  files: PhotoFile[];

  @Column({ name: 'theme' })
  @Field()
  title: string;

  @Column({ nullable: true, length: 700 })
  @Field()
  payload: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  author: User;

  @Column()
  @Field(() => Int)
  familyId: number;

  @ManyToOne(() => Family, { onDelete: 'CASCADE' })
  @Field(() => Family)
  family: Family;

  @OneToMany(() => PhotoComment, (comment) => comment.photo)
  @Field(() => [PhotoComment])
  comments: PhotoComment[];

  // DB에 별도로 저장하지 않고 file 개수 셀 때 Url로 세면서 1개 가져오기
  // @Column()
  @Field()
  thumbnailUrl: string;

  commentsCount?: number;
  isLiked?: boolean;
  filesCount?: number;

  // field로 넣을 필요는 없음; 사용자 본인이 like 했는지 확인하는 용도
  @OneToMany(() => PhotoLike, (like) => like.photo, { onDelete: 'CASCADE' })
  likes: PhotoLike[];
}
