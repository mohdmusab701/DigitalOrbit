import { SignJWT, jwtVerify } from "jose";

/**
 * JWT utilities using the jose library for Edge runtime compatibility.
 */

export async function signJWT(payload: Record<string, any>, secret: string): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

export async function verifyJWT<T = any>(token: string, secret: string): Promise<T | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload as T;
  } catch (error) {
    return null;
  }
}
