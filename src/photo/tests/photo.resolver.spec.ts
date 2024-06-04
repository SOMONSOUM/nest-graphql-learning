import { Test, TestingModule } from '@nestjs/testing';
import { PhotoResolver } from '../photo.resolver';
import { PhotoService } from '../photo.service';

describe('PhotoResolver', () => {
  let resolver: PhotoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotoResolver, PhotoService],
    }).compile();

    resolver = module.get<PhotoResolver>(PhotoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
