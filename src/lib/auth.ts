import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "astro_admin";

function secret() {
  return process.env.ADMIN_PASSWORD ?? "admin";
}

function makeToken() {
  return crypto
    .createHash("sha256")
    .update(`astro-admin::${secret()}`)
    .digest("hex");
}

export function verifyPassword(password: string) {
  return password === secret();
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token === makeToken();
}
