import dotenv from "dotenv";

import { prisma } from "../prisma/client";

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
