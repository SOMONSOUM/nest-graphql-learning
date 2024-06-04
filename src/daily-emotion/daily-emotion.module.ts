import { Module } from '@nestjs/common';
import { DailyEmotionService } from './daily-emotion.service';
import { DailyEmotionResolver } from './daily-emotion.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEmotion } from './entities/daily-emotion.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyEmotion, User])],
  providers: [DailyEmotionResolver, DailyEmotionService],
})
export class DailyEmotionModule {}
