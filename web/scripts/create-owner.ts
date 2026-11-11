import { hash } from "argon2";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { prisma } from "../src/lib/prisma";

function readHidden(prompt: string): Promise<string> {
  if (!stdin.isTTY || !stdin.setRawMode) throw new Error("Owner setup requires an interactive terminal so the password can be entered without echoing.");
  stdout.write(prompt);
  stdin.setEncoding("utf8");
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
      stdout.write("\n");
    };
    const onData = (chunk: string) => {
      for (const character of chunk) {
        if (character === "\u0003") {
          cleanup();
          reject(new Error("Owner setup cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          cleanup();
          resolve(value);
          return;
        }
        if (character === "\u007f" || character === "\b") {
          value = value.slice(0, -1);
          continue;
        }
        if (character >= " ") value += character;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const terminal = createInterface({ input: stdin, output: stdout });
  try {
    const email = (await terminal.question("Owner email: ")).trim().toLowerCase();
    terminal.close();
    const password = await readHidden("Owner password (minimum 12 characters; input hidden): ");
    const confirmation = await readHidden("Confirm password (input hidden): ");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
    if (password.length < 12) throw new Error("Password must be at least 12 characters.");
    if (password !== confirmation) throw new Error("Passwords do not match.");
    if (await prisma.user.count()) throw new Error("An owner is already configured. Public owner creation is disabled.");

    const passwordHash = await hash(password, { type: 2, memoryCost: 65536, timeCost: 3, parallelism: 1 });
    await prisma.user.create({ data: { email, passwordHash, profile: { create: {} }, settings: { create: {} } } });
    console.info("Owner account created. Keep the password in a password manager.");
  } finally {
    terminal.close();
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Owner setup failed.");
  process.exitCode = 1;
});
