
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "campusvault_session";

const SESSION_DURATION = 60 * 60 * 24 * 7;

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be at least 32 characters."
    );
  }

  return new TextEncoder().encode(secret);
}

// Create JWT session
export async function createSessionToken(
  userId: string,
  role: string
) {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionSecret());
}

// Verify JWT session
export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      getSessionSecret(),
      { algorithms: ["HS256"] }
    );

    if (!payload.sub) {
      return null;
    }

    return {
      userId: payload.sub,
    };
  } catch {
    return null;
  }
}

// Cookie configuration
export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DURATION,
};
