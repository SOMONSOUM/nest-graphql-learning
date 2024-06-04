import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { gqlAuthReq } from './utils/request';
import { FamilyResDTO } from 'src/family/dto/family-res.dto';
import { TEST_FAMILY_ID, TEST_USER_ID } from './utils/config';
import { InviteFamilyResDTO } from 'src/family/dto/invite-family-res.dto';

describe('Family Module (e2e)', () => {
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

  it('find my family (본인 포함)', () => {
    const query = `
      query {
        findMyFamily {
          result
          error
          family {
            id
            users {
              id
              userName
              email
            }
          }
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect(
        ({
          body: {
            data: {
              findMyFamily: { result, error, family },
            },
          },
        }: {
          body: { data: { findMyFamily: FamilyResDTO } };
        }) => {
          expect(result).toBe(true);
          expect(error).toBe(null);
          expect(family.id).toBe(TEST_FAMILY_ID);
          expect(family.users.map((user) => user.id)).toContain(TEST_USER_ID);
        },
      );
  });

  it('find my family (본인 제외)', () => {
    const query = `
      query {
        findMyFamily(exceptMe: ${true}) {
          result
          error
          family {
            id
            users {
              id
              userName
              email
            }
          }
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect(
        ({
          body: {
            data: {
              findMyFamily: { result, error, family },
            },
          },
        }: {
          body: { data: { findMyFamily: FamilyResDTO } };
        }) => {
          expect(result).toBe(true);
          expect(error).toBe(null);
          expect(family.id).toBe(TEST_FAMILY_ID);
          expect(family.users.map((user) => user.id)).not.toContain(
            TEST_USER_ID,
          );
        },
      );
  });

  it('invite family', () => {
    const query = `
      mutation {
        inviteFamily {
          result
          error
          token
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect(
        ({
          body: {
            data: {
              inviteFamily: { result, error, token },
            },
          },
        }: {
          body: { data: { inviteFamily: InviteFamilyResDTO } };
        }) => {
          expect(result).toBe(true);
          expect(error).toBe(null);
          expect(token).not.toBeNull();
        },
      );
  });

  it('join family', () => {
    // E2E TEST TODO
  });
});
