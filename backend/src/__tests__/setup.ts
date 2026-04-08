import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

import { prisma } from "../prisma/client";

const envTestPath = resolve(__dirname, "../../.env.test");
if (existsSync(envTestPath)) {
  dotenv.config({ path: envTestPath });
}
dotenv.config();

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

beforeAll(async () => {
  if (hasDatabaseUrl) {
    await prisma.$connect();
  }
});

afterAll(async () => {
  if (hasDatabaseUrl) {
    await prisma.$disconnect();
  }
});
