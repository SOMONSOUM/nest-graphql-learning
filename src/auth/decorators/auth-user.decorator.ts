import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    /**
     * Graphql 환경에서 동작할 수 있도록 Http Request 변환
     * (REST API도 동일한 코드로 정상 동작)
     */

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const req = gqlContext.req;

    return req.user;
  },
);
