import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { gqlAuthReq } from './utils/request';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { DailyEmotionType } from 'src/daily-emotion/constants/daily-emotion-type.enum';
import { DailyEmoResDTO } from 'src/daily-emotion/dto/daily-emo-res.dto';
import {
  TEST_FAMILY_USER_ID1,
  TEST_FAMILY_USER_ID2,
  TEST_USER_ID,
} from './utils/config';
import { Repository } from 'typeorm';
import { DailyEmotion } from 'src/daily-emotion/entities/daily-emotion.entity';
import { DailyEmosResDTO } from 'src/daily-emotion/dto/daily-emos-res.dto';
import { DailyEmoByDateResDTO } from 'src/daily-emotion/dto/daily-emo-by-date-res.dto';

describe('Daily Emotion Module (e2e)', () => {
  let app: INestApplication;
  let dailyEmoRepository: Repository<DailyEmotion>;

  const today = new Date(new Date().toLocaleDateString('ko-KR')).toISOString();
  const dayInMilliSec = 1000 * 60 * 60 * 24;
  const now = new Date().getTime();
  const emoTgtDate = [1, 2, 3].map(
    (day) =>
      new Date(
        new Date(
          now - (now % dayInMilliSec) - dayInMilliSec * day,
        ).toLocaleDateString('ko-KR'),
      ),
  );

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dailyEmoRepository = moduleFixture.get('DailyEmotionRepository');

    await app.init();
  });

  afterAll(async () => {
    try {
      // test 중 생성된 emotion clean up
      await dailyEmoRepository
        .createQueryBuilder('emo')
        .delete()
        .from(DailyEmotion)
        .where('date IN (:...dates)', {
          dates: [...emoTgtDate, new Date(today)],
        })
        .andWhere('user.id IN (:...ids)', {
          ids: [TEST_USER_ID, TEST_FAMILY_USER_ID1, TEST_FAMILY_USER_ID2],
        })
        .execute();
    } catch (e) {
      console.error(e.message);
    } finally {
      await app.close();
    }
  });

  it('create my daily emotion', async () => {
    const emoChoice = DailyEmotionType.happy;

    const query = `
        mutation {
            chooseEmotion(type: ${emoChoice}) {
                result
                error
            }
        }
    `;

    // 1. test create daily emotion
    await gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { chooseEmotion: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              chooseEmotion: { result, error },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBeNull();
      });

    // 2. test create result using findMyEmotion Today
    const findQuery = `
      query {
        findMyEmotionToday {
            result
            error
            dailyEmotion {
              type
              date
              userId
            }
          }
      }
    `;

    await gqlAuthReq(app, findQuery)
      .expect(200)
      .expect(
        (res: { body: { data: { findMyEmotionToday: DailyEmoResDTO } } }) => {
          const {
            body: {
              data: {
                findMyEmotionToday: { result, error, dailyEmotion },
              },
            },
          } = res;

          expect(result).toBe(true);
          expect(error).toBeNull();

          expect(dailyEmotion.userId).toBe(TEST_USER_ID);
          expect(dailyEmotion.date).toBe(today);
          expect(dailyEmotion.type).toBe(emoChoice);
        },
      );
  });

  it('edit my daily emotion', async () => {
    const emoChoice = DailyEmotionType.tired;

    const query = `
        mutation {
            chooseEmotion(type: ${emoChoice}) {
                result
                error
            }
        }
    `;

    // 1, test edit daily emotion
    await gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { chooseEmotion: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              chooseEmotion: { result, error },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBeNull();
      });

    // 2. test create result using findMyEmotion Today
    const findQuery = `
      query {
        findMyEmotionToday {
          result
          error
          dailyEmotion {
            userId
            type
            date
          }
        }
      }
  `;

    await gqlAuthReq(app, findQuery)
      .expect(200)
      .expect(
        (res: { body: { data: { findMyEmotionToday: DailyEmoResDTO } } }) => {
          const {
            body: {
              data: {
                findMyEmotionToday: { result, error, dailyEmotion },
              },
            },
          } = res;

          expect(result).toBe(true);
          expect(error).toBeNull();

          expect(dailyEmotion.userId).toBe(TEST_USER_ID);
          expect(dailyEmotion.date).toBe(today);
          expect(dailyEmotion.type).toBe(emoChoice);
        },
      );
  });

  it('edit my daily emotion (같은 타입으로 수정 요청 - insert/update does not fire)', async () => {
    const emoChoice = DailyEmotionType.tired;

    const query = `
        mutation {
            chooseEmotion(type: ${emoChoice}) {
                result
                error
            }
        }
    `;

    await gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { chooseEmotion: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              chooseEmotion: { result, error },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBeNull();
      });
  });

  it('delete my daily emotion', async () => {
    const query = `
        mutation {
            deleteEmotion {
                result
                error
            }
        }
    `;

    // 1, test edit daily emotion
    await gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { deleteEmotion: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              deleteEmotion: { result, error },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBeNull();
      });

    // 2. test create result using findMyEmotion Today
    const findQuery = `
      query {
        findMyEmotionToday {
            result
            error
            dailyEmotion {
              userId
              type
              date
            }
          }
      }
    `;

    await gqlAuthReq(app, findQuery)
      .expect(200)
      .expect(
        (res: { body: { data: { findMyEmotionToday: DailyEmoResDTO } } }) => {
          const {
            body: {
              data: {
                findMyEmotionToday: { result, error, dailyEmotion },
              },
            },
          } = res;

          expect(result).toBe(true);
          expect(error).toBeNull();
          expect(dailyEmotion).toBeNull();
        },
      );
  });

  it('delete my daily emotion (지울 것 없을 때)', async () => {
    const query = `
        mutation {
            deleteEmotion {
                result
                error
            }
        }
    `;

    // 1, test edit daily emotion
    await gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { deleteEmotion: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              deleteEmotion: { result, error },
            },
          },
        } = res;

        expect(result).toBe(false);
        expect(error).toBe(
          'Cannot delete the daily emotion. Might be due to invalid emotionId or unauthenticated user.',
        );
      });
  });

  it('find family emotion today', async () => {
    const emoChoices = [
      DailyEmotionType.passion,
      DailyEmotionType.happy,
      DailyEmotionType.comfort,
    ];

    // 1. 가족의 감정 선택 생성
    await dailyEmoRepository
      .createQueryBuilder('emo')
      .insert()
      .into(DailyEmotion)
      .values([
        {
          user: { id: TEST_USER_ID },
          type: emoChoices[0],
          date: new Date(today),
        },
        {
          user: { id: TEST_FAMILY_USER_ID1 },
          type: emoChoices[1],
          date: new Date(today),
        },
        {
          user: { id: TEST_FAMILY_USER_ID2 },
          type: emoChoices[2],
          date: new Date(today),
        },
      ])
      .updateEntity(false)
      .execute();

    // 2. gql 확인
    const query = `
      query {
        findFamilyEmotionsToday {
            result
            error
            dailyEmotions {
                userId
                user {
                    id
                    userName
                }
                type
                date
            }
        }
      }
    `;

    await gqlAuthReq(app, query)
      .expect(200)
      .expect(
        (res: {
          body: { data: { findFamilyEmotionsToday: DailyEmosResDTO } };
        }) => {
          const {
            body: {
              data: {
                findFamilyEmotionsToday: { result, error, dailyEmotions },
              },
            },
          } = res;

          expect(result).toBe(true);
          expect(error).toBeNull();

          /**
           * 정렬 순서: 본인(1순위) 이외 userId 오름차순
           * (TEST_FAMILY_USER_ID1 < TEST_FAMILY_USER_ID2)
           */
          expect(dailyEmotions[0].userId).toBe(TEST_USER_ID);
          expect(dailyEmotions[1].userId).toBe(TEST_FAMILY_USER_ID1);
          expect(dailyEmotions[2].userId).toBe(TEST_FAMILY_USER_ID2);

          expect(dailyEmotions.map((e) => e.user.userName)).not.toContain(null);
          dailyEmotions.forEach((e) => expect(e.date).toBe(today));
          dailyEmotions.forEach((e, i) => expect(e.type).toBe(emoChoices[i]));
        },
      );
  });

  it('find family emotion past with pagination', async () => {
    // 가족의 감정 선택 생성
    await dailyEmoRepository
      .createQueryBuilder('emo')
      .insert()
      .into(DailyEmotion)
      .values([
        {
          user: { id: TEST_FAMILY_USER_ID2 },
          type: DailyEmotionType.sad,
          date: emoTgtDate[2],
        },
        {
          user: { id: TEST_USER_ID },
          type: DailyEmotionType.sharp,
          date: emoTgtDate[1],
        },
        {
          user: { id: TEST_FAMILY_USER_ID1 },
          type: DailyEmotionType.tired,
          date: emoTgtDate[1],
        },
        {
          user: { id: TEST_FAMILY_USER_ID1 },
          type: DailyEmotionType.tired,
          date: emoTgtDate[0],
        },
        {
          user: { id: TEST_FAMILY_USER_ID2 },
          type: DailyEmotionType.comfort,
          date: emoTgtDate[0],
        },
        {
          user: { id: TEST_USER_ID },
          type: DailyEmotionType.sharp,
          date: emoTgtDate[0],
        },
      ])
      .updateEntity(false)
      .execute();

    const take = 2;

    const query = `
      query {
        findFamilyEmotions(prevDate: "${today}", take: ${take}) {
            result
            error
            dailyEmotionsByDate {
                date
                dailyEmotions {
                    userId
                    user {
                        id
                        userName
                    }
                    date
                    type
                }
            }
        }
      }
    `;

    await gqlAuthReq(app, query)
      .expect(200)
      .expect(
        (res: {
          body: { data: { findFamilyEmotions: DailyEmoByDateResDTO } };
        }) => {
          const {
            body: {
              data: {
                findFamilyEmotions: { result, error, dailyEmotionsByDate },
              },
            },
          } = res;

          expect(result).toBe(true);
          expect(error).toBeNull();

          // 아무도 선택하지 않은 날은 해당 값 없음 => 반드시 take === length 아님 (따라서 아래 주석처리)
          //   expect(dailyEmotionsByDate.length).toBe(take);

          dailyEmotionsByDate.forEach(({ date, dailyEmotions }, i) => {
            expect(date).toBe(emoTgtDate[i].toISOString());

            expect(dailyEmotions[0].userId).toBe(TEST_USER_ID);
            expect(dailyEmotions[0].type).toBe(DailyEmotionType.sharp);

            expect(dailyEmotions[1].userId).toBe(TEST_FAMILY_USER_ID1);
            expect(dailyEmotions[1].type).toBe(DailyEmotionType.tired);
          });
        },
      );
  });

  it('poke family daily emotion', () => {
    // notif 요청 외에 특별히 하는 일 없음
    const query = `
      mutation {
        pokeFamilyEmotion(targetId: ${TEST_FAMILY_USER_ID1}) {
            result
            error
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect(
        (res: { body: { data: { pokeFamilyEmotion: BaseResponseDTO } } }) => {
          const {
            body: {
              data: {
                pokeFamilyEmotion: { result, error },
              },
            },
          } = res;

          expect(result).toBe(true);
          expect(error).toBeNull();
        },
      );
  });
});
