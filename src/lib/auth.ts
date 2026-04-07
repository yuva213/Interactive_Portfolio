import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secretKey = "c89Hjd72J@9kL3vP5q1Xo4ZmWn0EbIyR"; // Fallback secret
const key = new TextEncoder().encode(process.env.JWT_SECRET || secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: any) {
  const user = { username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD };

  if (
    formData.username === user.username &&
    formData.password === user.password
  ) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user: formData.username, expires });

    (await cookies()).set("session", session, { expires, httpOnly: true });
    return true;
  }
  return false;
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = new Response();
  res.headers.set(
    "Set-Cookie",
    `session=${await encrypt(parsed)}; HttpOnly; Path=/; Expires=${parsed.expires.toUTCString()}`
  );
  return res;
}
