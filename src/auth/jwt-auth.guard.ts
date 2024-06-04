import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { IS_ADMIN_KEY } from './decorators/admin.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * REST API 중 Public 데코레이터가 적용된 것은 canActivate만 적용
   * (return true 하기 때문)
   * 이후에 나오는 getRequest로 넘어가지 않기에 gql execution context로 변환되지 않음
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isAdmin = this.reflector.getAllAndOverride(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isAdmin) {
      request['isAdmin'] = Boolean(isAdmin);
    }

    return super.canActivate(context);
  }

  /**
   * canActivate 이후 실행
   * gql 환경에서 사용할 수 있도록 Http Request 변환
   * REST API 환경에서 동일하게 적용되어
   * REST의 모든 엔드포인트도 결국 gql로 변환 됨
   */
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    return gqlContext.req;
  }
}
