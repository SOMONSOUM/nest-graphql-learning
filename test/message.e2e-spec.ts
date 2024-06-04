import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { gqlAuthReq } from './utils/request';
import { TEST_FAMILY_ID, TEST_USER_ID } from './utils/config';
import { MsgResDTO } from 'src/message/dto/message-res.dto';
import { MsgsResDTO } from 'src/message/dto/messages-res.dto';
import { BaseResponseDTO } from 'src/common/dto/base-res.dto';
import { CreateResDTO } from 'src/common/dto/create-res.dto';
import { MsgCommentsResDTO } from 'src/message/dto/message-comments-res.dto';

describe('Message Module (e2e)', () => {
  let app: INestApplication;
  let messageFamId: number;
  const msgIdNotMyFam = 1082;
  const commentIdNotMyFam = 16;
  const commentsCreated: number[] = [];

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

  it('find message latest', () => {
    const query = `
      query {
        findMsgLatest {
            result
            error
            messageFam {
                id
                receiveDate
                message {
                    id
                    payload
                    emotion
                }
                commentsCount
                isKept
                familyId
            }
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { findMsgLatest: MsgResDTO } } }) => {
        const {
          body: {
            data: {
              findMsgLatest: { result, error, messageFam },
            },
          },
        } = res;

        messageFamId = messageFam.id;

        expect(result).toBe(true);
        expect(error).toBeNull();
        expect(messageFam.familyId).toBe(TEST_FAMILY_ID);
        expect(messageFam.commentsCount).toBeGreaterThanOrEqual(0);
        expect(messageFam.isKept).not.toBeNull();
        expect(messageFam.message.payload).not.toBeNull();
        expect(messageFam.message.emotion).not.toBeNull();
        expect(messageFam.receiveDate).not.toBeNull();
      });
  });

  it('find single msg with id', () => {
    const query = `
      query {
        findMsg(messageFamId: ${messageFamId}) {
            result
            error
            messageFam {
                id
                receiveDate
                message {
                    id
                    payload
                    emotion
                }
                commentsCount
                isKept
                familyId
            }
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { findMsg: MsgResDTO } } }) => {
        const {
          body: {
            data: {
              findMsg: { result, error, messageFam },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBeNull();
        expect(messageFam.familyId).toBe(TEST_FAMILY_ID);
        expect(messageFam.commentsCount).toBeGreaterThanOrEqual(0);
        expect(messageFam.isKept).not.toBeNull();
        expect(messageFam.message.payload).not.toBeNull();
        expect(messageFam.message.emotion).not.toBeNull();
        expect(messageFam.receiveDate).not.toBeNull();
      });
  });

  it('find multiple msgs with pagination', () => {
    const take = 10;
    const prev = 0;

    const query = `
      query {
        findMsgs (take: ${take}, prev: ${prev}) {
            result
            error
            messageFams {
                id
                receiveDate
                message {
                    id
                    payload
                    emotion
                }
                familyId
            }
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { findMsgs: MsgsResDTO } } }) => {
        const {
          body: {
            data: {
              findMsgs: { result, error, messageFams },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBeNull();

        // pagination 성공 여부 (전제: 충분히 많은 message가 이미 존재)
        expect(messageFams.length).toBe(take);
        expect(messageFams[0].id).toBe(messageFamId);

        expect(messageFams[0].familyId).toBe(TEST_FAMILY_ID);
        expect(messageFams[0].message.payload).not.toBeNull();
        expect(messageFams[0].message.emotion).not.toBeNull();
        expect(messageFams[0].receiveDate).not.toBeNull();
      });
  });

  /* 아래와 같이 keep -> findKept -> unkeep 순서 지켜야 정상 동작 */

  it('keep msg', () => {
    const query = `
      mutation {
        keepMsg(messageFamId: ${messageFamId}) {
            result
            error
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { keepMsg: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              keepMsg: { result, error },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBe(null);
      });
  });

  it('find kept msgs with pagination', () => {
    const take = 2;
    const prev = 0;

    const query = `
      query {
        findMsgsKept (take: ${take}, prev: ${prev}) {
            result
            error
            messageFams {
                id
                receiveDate
                message {
                    id
                    payload
                    emotion
                }
                familyId
                isKept
            }
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { findMsgsKept: MsgsResDTO } } }) => {
        const {
          body: {
            data: {
              findMsgsKept: { result, error, messageFams },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBeNull();

        // pagination 성공 여부 (전제: 충분히 많은 message가 이미 존재)
        expect(messageFams.length).toBe(take);
        expect(messageFams[0].id).toBe(messageFamId);

        expect(messageFams[0].familyId).toBe(TEST_FAMILY_ID);
        expect(messageFams[0].message.payload).not.toBeNull();
        expect(messageFams[0].message.emotion).not.toBeNull();
        expect(messageFams[0].isKept).toBe(true);
        expect(messageFams[0].receiveDate).not.toBeNull();
      });
  });

  it('unkeep msg', () => {
    const query = `
        mutation {
          unkeepMsg(messageFamId: ${messageFamId}) {
              result
              error
          }
        }
      `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { unkeepMsg: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              unkeepMsg: { result, error },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBe(null);
      });
  });

  /* 중복 keep => 중복 unkeep 순서 */

  it('중복 keep', async () => {
    const query = `
      mutation {
        keepMsg(messageFamId: ${messageFamId}) {
            result
            error
        }
      }
    `;

    // 1. 첫번째 keep (expect 성공)
    await gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { keepMsg: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              keepMsg: { result, error },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBe(null);
      });

    // 2. 같은 이야기 다시 keep (return result: false)
    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { keepMsg: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              keepMsg: { result, error },
            },
          },
        } = res;

        expect(result).toBe(false);
        expect(error).toBe('Already kept message.');
      });
  });

  it('중복 unkeep', async () => {
    const query = `
      mutation {
        unkeepMsg(messageFamId: ${messageFamId}) {
            result
            error
        }
      }
    `;

    // 1. 첫번째 keep (expect 성공)
    await gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { unkeepMsg: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              unkeepMsg: { result, error },
            },
          },
        } = res;

        expect(result).toBe(true);
        expect(error).toBe(null);
      });

    // 2. 같은 이야기 다시 unkeep (return result: false)
    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { unkeepMsg: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              unkeepMsg: { result, error },
            },
          },
        } = res;

        expect(result).toBe(false);
        expect(error).toBe(
          'Cannot unkeep message. (Cannot delete MessageKeep.)',
        );
      });
  });

  it('우리가족 이야기 아닌 것 keep 에러', () => {
    const query = `
      mutation {
        keepMsg(messageFamId: ${msgIdNotMyFam}) {
            result
            error
        }
      }`;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { keepMsg: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              keepMsg: { result, error },
            },
          },
        } = res;

        expect(result).toBe(false);
        expect(error).toBe('Cannot keep given message family.');
      });
  });

  it('우리가족 이야기 아닌 것 unkeep 에러', () => {
    const query = `
      mutation {
        unkeepMsg(messageFamId: ${msgIdNotMyFam}) {
            result
            error
        }
      }`;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { unkeepMsg: BaseResponseDTO } } }) => {
        const {
          body: {
            data: {
              unkeepMsg: { result, error },
            },
          },
        } = res;

        expect(result).toBe(false);
        expect(error).toBe('Cannot unkeep given message family.');
      });
  });

  /* comment -> find comments -> delete comment 순서 */

  it('create msg comment', async () => {
    const testPayload = 'comment test payload.';
    const query = `
      mutation {
        createMsgComment(messageFamId: ${messageFamId}, payload: "${testPayload}") {
            result
            error
            id
        }
      }
    `;

    // 1. 첫번째 comment 생성
    await gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { createMsgComment: CreateResDTO } } }) => {
        const {
          body: {
            data: {
              createMsgComment: { result, error, id },
            },
          },
        } = res;

        commentsCreated.push(id);

        expect(result).toBe(true);
        expect(error).toBeNull();
      });

    // 2. 두번째 comment 생성
    return gqlAuthReq(app, query)
      .expect(200)
      .expect((res: { body: { data: { createMsgComment: CreateResDTO } } }) => {
        const {
          body: {
            data: {
              createMsgComment: { result, error, id },
            },
          },
        } = res;

        commentsCreated.push(id);

        expect(result).toBe(true);
        expect(error).toBeNull();
      });
  });

  it('find comments with msgId', () => {
    const take = 1;
    const prev = 1;

    const query = `
      query {
        findMsgComments(messageFamId: ${messageFamId}, take: ${take}, prev: ${prev}) {
            result
            error
            comments {
                id
                payload
                author {
                    id
                    userName
                }
            }
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect(
        (res: { body: { data: { findMsgComments: MsgCommentsResDTO } } }) => {
          const {
            body: {
              data: {
                findMsgComments: { result, error, comments },
              },
            },
          } = res;

          expect(result).toBe(true);
          expect(error).toBeNull();
          expect(comments.length).toBe(take);
          expect(comments[0].id).toBe(
            commentsCreated[commentsCreated.length - 1 - take * prev],
          );
          expect(comments[0].author.id).toBe(TEST_USER_ID);
        },
      );
  });

  it('delete msg comment', async () => {
    await Promise.all(
      commentsCreated.map((commentId) => {
        const query = `
        mutation {
            deleteMsgComment(commentId: ${commentId}) {
                result
                error
            }
        }
      `;

        return gqlAuthReq(app, query)
          .expect(200)
          .expect(
            (res: {
              body: { data: { deleteMsgComment: BaseResponseDTO } };
            }) => {
              const {
                body: {
                  data: {
                    deleteMsgComment: { result, error },
                  },
                },
              } = res;

              expect(result).toBe(true);
              expect(error).toBeNull();
            },
          );
      }),
    );
  });

  it('우리가족 이야기 아닌 것 create comment 에러', () => {
    const testPayload = 'comment test payload.';
    const query = `
      mutation {
        createMsgComment(messageFamId: ${msgIdNotMyFam}, payload: "${testPayload}") {
            result
            error
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect(
        (res: { body: { data: { createMsgComment: BaseResponseDTO } } }) => {
          const {
            body: {
              data: {
                createMsgComment: { result, error },
              },
            },
          } = res;

          expect(result).toBe(false);
          expect(error).toBe('Cannot comment on the given message family.');
        },
      );
  });

  it('우리가족 이야기 아닌 것 delete comment 에러', () => {
    const query = `
      mutation {
        deleteMsgComment(commentId: ${commentIdNotMyFam}) {
            result
            error
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect(
        (res: { body: { data: { deleteMsgComment: BaseResponseDTO } } }) => {
          const {
            body: {
              data: {
                deleteMsgComment: { result, error },
              },
            },
          } = res;

          expect(result).toBe(false);
          expect(error).toBe('Cannot update comment status to DELETED.');
        },
      );
  });

  it('find comments with msgId fail (우리가족 이야기 아님 에러)', () => {
    const take = 1;
    const prev = 1;

    const query = `
      query {
        findMsgComments(messageFamId: ${msgIdNotMyFam}, take: ${take}, prev: ${prev}) {
            result
            error
            comments {
                id
                payload
                author {
                    id
                    userName
                }
            }
        }
      }
    `;

    return gqlAuthReq(app, query)
      .expect(200)
      .expect(
        (res: { body: { data: { findMsgComments: MsgCommentsResDTO } } }) => {
          const {
            body: {
              data: {
                findMsgComments: { result, error, comments },
              },
            },
          } = res;

          expect(result).toBe(false);
          expect(error).toBe('Cannot access to given message family.');
          expect(comments).toBeNull();
        },
      );
  });
});
