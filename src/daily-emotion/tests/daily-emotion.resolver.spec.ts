import { Test, TestingModule } from '@nestjs/testing';
import { DailyEmotionResolver } from '../daily-emotion.resolver';
import { DailyEmotionService } from '../daily-emotion.service';

describe('DailyEmotionResolver', () => {
  let resolver: DailyEmotionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyEmotionResolver, DailyEmotionService],
    }).compile();

    resolver = module.get<DailyEmotionResolver>(DailyEmotionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
