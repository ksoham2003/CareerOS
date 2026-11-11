import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "careeros_session";
const SESSION_DAYS = 14;
const MAX_SESSIONS_PER_USER = 5;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.$transaction(async (transaction) => {
    await transaction.session.deleteMany({ where: { userId, expiresAt: { lte: new Date() } } });
    const active = await transaction.session.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { id: true } });
    const excess = active.slice(MAX_SESSIONS_PER_USER - 1).map((session) => session.id);
    if (excess.length) await transaction.session.deleteMany({ where: { id: { in: excess } } });
    await transaction.session.create({ data: { tokenHash, userId, expiresAt } });
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!rawToken) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    select: { expiresAt: true, user: { select: { id: true, email: true } } },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(COOKIE_NAME)?.value;
  if (rawToken) await prisma.session.deleteMany({ where: { tokenHash: hashToken(rawToken) } });
  cookieStore.delete(COOKIE_NAME);
}
