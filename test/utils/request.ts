import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JWT_FOR_TEST } from './config';

const GQL_ENDPOINT = '/api/v2/graphql';
const JWT_HEADER_FIELD = 'Authorization';

function httpReq(app: INestApplication<any>) {
  return request(app.getHttpServer()).post(GQL_ENDPOINT);
}

export function gqlPublicReq(app: INestApplication<any>, query: string) {
  return httpReq(app).send({ query });
}

export function gqlAuthReq(app: INestApplication<any>, query: string) {
  return httpReq(app)
    .set(JWT_HEADER_FIELD, `Bearer ${JWT_FOR_TEST}`)
    .send({ query });
}
