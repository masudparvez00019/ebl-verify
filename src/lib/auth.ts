import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'ebl_verify_super_secret_jwt_key_2026_masud_parvez';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export const AUTH_COOKIE_NAME = 'ebl_admin_token';

export interface UserJwtPayload {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export async function createSessionToken(payload: UserJwtPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as UserJwtPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserJwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}
