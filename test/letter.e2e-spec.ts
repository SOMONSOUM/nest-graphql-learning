import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('Letter module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('send letter - 즉시 전송', () => {});

  it('send letter - 임시저장', () => {});

  it('send letter - 타임캡슐', () => {});

  it('send letter - 가족 아닌 사용자에게 전송 실패', () => {});

  it('read letter', () => {});

  it('read letter - receiver 아닌 경우 에러', () => {});

  it('edit letter', () => {});

  it('edit letter - sender 아닌 경우 에러', () => {});

  it('delete letter', () => {});

  it('delete letter - receiver 아닌 경우 에러', () => {});

  it('find letter - SENT', () => {});

  it('find letter - SENT, sender 아닌 경우 에러', () => {});

  it('find letter - RECEIVED, receiver 아닌 경우 에러', () => {});

  it('find letter - RECEIVED', () => {});

  it('find letter box - SENT & ALL', () => {});

  it('find letter box - SENT & Time Capsule Only', () => {});

  it('find letter box - SENT, sender 아닌 경우 에러', () => {});

  it('find letter box - RECEIVED & ALL', () => {});

  it('find letter box - RECEIVED & Time Capsule Only', () => {});

  it('find letter box - RECEIVED & Kept', () => {});

  it('find letter box - RECEIVED, receiver 아닌 경우 에러', () => {});

  it('keep letter', () => {});

  it('keep letter - receiver 아닌 경우 에러', () => {});

  it('unkeep letter', () => {});

  it('unkeep letter - receiver 아닌 경우 에러', () => {});

  it('get letter guide', () => {});
});
