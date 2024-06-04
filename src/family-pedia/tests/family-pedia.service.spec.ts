import { Test, TestingModule } from '@nestjs/testing';
import { FamilyPediaService } from '../family-pedia.service';

describe('FamilyPediaService', () => {
  let service: FamilyPediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamilyPediaService],
    }).compile();

    service = module.get<FamilyPediaService>(FamilyPediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
