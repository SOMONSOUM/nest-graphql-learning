import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('Photo Module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('find photos', () => {});

  it('find single photo', () => {});

  it('우리 가족 아닌 find single photo error', () => {});

  it('like photo', () => {});

  it('우리 가족 아닌 like photo', () => {});

  it('중복 like photo', () => {});

  it('unlike photo', () => {});

  it('중복 unlike photo', () => {});

  it('create comment photo', () => {});

  it('find photo comments', () => {});

  it('delete comment', () => {});

  it('우리 가족 아닌 photo create comment error', () => {});

  it('우리 가족 아닌 find photo comments', () => {});

  it('edit photo', () => {});

  it('delete photo', () => {});

  it('본인 소유 아닌 photo edit error', () => {});

  it('본인 소유 아닌 photo delete error', () => {});

  it('우리 가족 아닌 photo edit error', () => {});

  it('우리 가족 아닌 photo delete error', () => {});
});
