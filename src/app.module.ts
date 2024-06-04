import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { UserAuth } from './user/entities/user-auth.entity';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { BannerModule } from './banner/banner.module';
import { FamilyModule } from './family/family.module';
import { FamilyPediaModule } from './family-pedia/family-pedia.module';
import { LetterModule } from './letter/letter.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { PhotoModule } from './photo/photo.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { Family } from './family/entities/family.entity';
import { Notification } from './notification/entities/notification.entity';
import { Message } from './message/entities/message.entity';
import { MessageFamily } from './message/entities/message-family.entity';
import { MessageKeep } from './message/entities/message-keep.entity';
import { MessageComment } from './message/entities/message-comment.entity';
import { Banner } from './banner/entities/banner.entity';
import { BannerPayloadPlacement } from './banner/entities/banner-payload-placement.entity';
import { DailyEmotion } from './daily-emotion/entities/daily-emotion.entity';
import { Inquiry } from './inquiry/entities/inquiry.entity';
import { Photo } from './photo/entities/photo.entity';
import { PhotoFile } from './photo/entities/photo-file.entity';
import { PhotoComment } from './photo/entities/photo-comment.entity';
import { PhotoLike } from './photo/entities/photo-like.entity';
import { Letter } from './letter/entities/letter.entity';
import { LetterGuide } from './letter/entities/letter-guide.entity';
import { FamilyPedia } from './family-pedia/entities/family-pedia.entity';
import { FamilyPediaQuestion } from './family-pedia/entities/family-pedia-question';
import { DailyEmotionModule } from './daily-emotion/daily-emotion.module';
import { SqsNotificationModule } from './sqs-notification/sqs-notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    EventEmitterModule.forRoot({ ignoreErrors: false }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        UserAuth,
        Family,
        Notification,
        Message,
        MessageFamily,
        MessageKeep,
        MessageComment,
        DailyEmotion,
        Banner,
        BannerPayloadPlacement,
        Inquiry,
        Photo,
        PhotoFile,
        PhotoComment,
        PhotoLike,
        Letter,
        LetterGuide,
        FamilyPedia,
        FamilyPediaQuestion,
      ],
      synchronize: false,
      logging: true,
      timezone: '+09:00',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/api/v2/graphql',
      plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
      playground: false,
    }),
    UserModule,
    AuthModule,
    UploadModule,
    AdminModule,
    BannerModule,
    FamilyModule,
    FamilyPediaModule,
    LetterModule,
    MessageModule,
    NotificationModule,
    PhotoModule,
    InquiryModule,
    DailyEmotionModule,
    SqsNotificationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
