import { Test, TestingModule } from '@nestjs/testing';
import { LetterResolver } from '../letter.resolver';
import { LetterService } from '../letter.service';

describe('LetterResolver', () => {
  let resolver: LetterResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LetterResolver, LetterService],
    }).compile();

    resolver = module.get<LetterResolver>(LetterResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
