import { Test, TestingModule } from '@nestjs/testing';
import { DailyEmotionService } from '../daily-emotion.service';

describe('DailyEmotionService', () => {
  let service: DailyEmotionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyEmotionService],
    }).compile();

    service = module.get<DailyEmotionService>(DailyEmotionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
