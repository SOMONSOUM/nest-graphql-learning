import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// GraphQL과 무관한 DTO (SQS로부터 consume)
export class CreateNotificationReqDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsString() // temp
  // @IsEnum() // TODO
  screen?: string;

  @IsOptional()
  @IsObject()
  param?: object;

  @IsNumber()
  @Min(1) // TODO: USER id 정책에 따라 범위 설정
  receiverId: number;
}
