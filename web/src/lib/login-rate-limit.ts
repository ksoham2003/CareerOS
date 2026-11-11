import "server-only";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export async function allowLoginAttempt(address: string) {
  const key = createHash("sha256").update(address).digest("hex");
  const now = new Date();
  const resetAt = new Date(now.getTime() + WINDOW_MS);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(async (transaction) => {
        const bucket = await transaction.loginThrottle.findUnique({ where: { key } });
        if (!bucket || bucket.resetAt <= now) {
          await transaction.loginThrottle.upsert({
            where: { key },
            create: { key, count: 1, resetAt },
            update: { count: 1, resetAt },
          });
          return true;
        }
        if (bucket.count >= MAX_ATTEMPTS) return false;
        const updated = await transaction.loginThrottle.update({ where: { key }, data: { count: { increment: 1 } } });
        return updated.count <= MAX_ATTEMPTS;
      }, { isolationLevel: "Serializable" });
    } catch (error) {
      if (!(error instanceof Error) || !("code" in error) || error.code !== "P2034" || attempt === 2) throw error;
    }
  }
  return false;
}
