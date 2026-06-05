import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  verifySessionToken,
} from "./session";

export {
  createSessionToken,
  getSessionMaxAge,
  SESSION_COOKIE,
  verifyPassword,
  verifySessionToken,
} from "./session";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}
