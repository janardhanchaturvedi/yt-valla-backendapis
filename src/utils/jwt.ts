import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';
import { config } from './config';

const secret = new TextEncoder().encode(config.jwt.secret);

export interface JWTPayload extends JoseJWTPayload {
  userId: string;
  email: string;
}

export const jwt = {
  async sign(payload: JWTPayload): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(config.jwt.expiresIn)
      .sign(secret);
  },

  async verify(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload as JWTPayload;
    } catch (error) {
      return null;
    }
  },
};
