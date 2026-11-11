import { prisma } from "../src/lib/prisma";

async function main() {
  const ownerCount = await prisma.user.count();
  if (ownerCount > 1) throw new Error("CareerOS expects a single owner; refusing to seed a multi-user database.");
  if (!ownerCount) {
    console.info("No owner exists. Run `npm run owner:create` after migrating to create the owner and initial profile.");
    return;
  }
  console.info("Owner profile and settings are created by the secure owner bootstrap command; no activity metrics are seeded.");
}

main().finally(async () => prisma.$disconnect());
