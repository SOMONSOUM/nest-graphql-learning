import { plainToInstance } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';

/**
 * 프로그래머가 직접 호출한 함수와 같이 Global Pipe를 타지 않는 환경에서도
 * class-validator을 쉽세 적용할 수 있도록 하는 decorator
 * @param classConstructor class-validator을 적용하기 위해 사용되는
 * class-transformer가 사용할 검증할 class. Plain object를 해당 클래스로 변환
 */
export function CustomValidate<T extends object>(
  classConstructor: new () => T,
) {
  return function (
    target: any,
    targetName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const validateTarget = plainToInstance(classConstructor, args[0]);

      if (Array.isArray(validateTarget)) {
        const validList: T[] = [];
        const invalidList: T[] = [];

        const errors = await Promise.all(
          validateTarget.map((elem) => validate(elem)),
        );

        errors.forEach((errList, idx) =>
          errList.length === 0
            ? validList.push(validateTarget[idx])
            : invalidList.push(validateTarget[idx]),
        );

        const errorMessage = `[ Validation Error ]\n Invalid Instances: ${JSON.stringify(invalidList)}\n Causes: ${errors}`;

        if (validList.length === 0) {
          throw new Error(errorMessage);
        }

        if (invalidList.length > 0) {
          console.error(errorMessage);
        }

        args[0] = validList;
      } else {
        await validateOrReject(validateTarget);
      }

      return method.apply(this, args);
    };
  };
}

// TODO: 여러 개의 argument를 패싱할 때 CustomValidator가 적용돼야 할 argument를 지정해주는 추가적인 데코레이터
