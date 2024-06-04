import { Test, TestingModule } from '@nestjs/testing';
import { InquiryResolver } from '../inquiry.resolver';
import { InquiryService } from '../inquiry.service';

describe('InquiryResolver', () => {
  let resolver: InquiryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InquiryResolver, InquiryService],
    }).compile();

    resolver = module.get<InquiryResolver>(InquiryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
