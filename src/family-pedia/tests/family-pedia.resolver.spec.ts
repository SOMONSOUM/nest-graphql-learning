import { Test, TestingModule } from '@nestjs/testing';
import { FamilyPediaResolver } from '../family-pedia.resolver';
import { FamilyPediaService } from '../family-pedia.service';

describe('FamilyPediaResolver', () => {
  let resolver: FamilyPediaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamilyPediaResolver, FamilyPediaService],
    }).compile();

    resolver = module.get<FamilyPediaResolver>(FamilyPediaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
