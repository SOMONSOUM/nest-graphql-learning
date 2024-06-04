import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_TYPE } from './constants/token-type.enum';
import { AuthUserId } from './constants/auth-user-id.type';
import appleSignin from 'apple-signin-auth';
import axios from 'axios';
import { promisify } from 'util';
import { createCipheriv, createDecipheriv, createHash, scrypt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /** JWT Methods */
  sign({
    userId,
    familyId,
    tokenType,
  }: {
    userId: number;
    familyId: number;
    tokenType: TOKEN_TYPE;
  }): string {
    const expiresIn = tokenType === TOKEN_TYPE.ACCESS ? '1h' : '15d';
    // const expiresIn = tokenType === TOKEN_TYPE.ACCESS ? '3m' : '15d';

    return this.jwtService.sign(
      { userId, familyId },
      { secret: process.env.JWT_SECRET_KEY, expiresIn },
    );
  }

  verify(token: string): AuthUserId {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
  }

  /** Encrytion */
  // 기본 encode는 hex,
  /** encryption */
  async encrypt({
    target,
    encode = 'base64url',
  }: {
    target: string;
    encode?: BufferEncoding;
  }): Promise<string> {
    const iv = Buffer.from(process.env.CRYPTO_IV);
    // const iv = randomBytes(16);

    const key = (await promisify(scrypt)(
      process.env.CRYPTO_KEY,
      process.env.CRYPTO_SALT,
      32,
    )) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedText = Buffer.concat([
      cipher.update(JSON.stringify({ result: target })),
      cipher.final(),
    ]);

    const result = encryptedText.toString(encode);

    return result;
  }

  /** decrption */
  async decrypt({
    target,
    encode = 'base64url',
  }: {
    target: string;
    encode?: BufferEncoding;
  }): Promise<string> {
    const iv = Buffer.from(process.env.CRYPTO_IV);

    const key = (await promisify(scrypt)(
      process.env.CRYPTO_KEY,
      process.env.CRYPTO_SALT,
      32,
    )) as Buffer;

    const targetBuf = Buffer.from(target, encode);

    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedBuf = Buffer.concat([
      decipher.update(targetBuf),
      decipher.final(),
    ]);

    const decryptedText: { result: string } = JSON.parse(
      decryptedBuf.toString(),
    );

    return decryptedText.result;
  }

  async appleLogin(
    id_token: string,
    nonce: string,
  ): Promise<{ email: string; id?: string }> {
    try {
      const { email, sub: userAppleId } = await appleSignin.verifyIdToken(
        id_token,
        {
          audience: 'com.wooriga.appservice',
          nonce: nonce
            ? createHash('sha256').update(nonce).digest('hex')
            : undefined,
        },
      );

      return { email, id: userAppleId };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async kakaoLogin(
    accessToken: string,
  ): Promise<{ email: string; id?: string }> {
    try {
      const result = await axios({
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        baseURL: 'https://kapi.kakao.com',
        url: 'v2/user/me',
      });

      return {
        email: result.data.kakao_account.email,
        id: String(result.data.id),
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async naverLogin(
    accessToken: string,
  ): Promise<{ email: string; id?: string }> {
    try {
      const result = await axios({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        baseURL: 'https://openapi.naver.com',
        url: '/v1/nid/me',
      });

      return { email: result.data.response.email, id: result.data.response.id };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
