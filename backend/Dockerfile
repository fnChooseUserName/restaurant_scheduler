FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY jest.config.cjs ./
COPY eslint.config.mjs ./
COPY src ./src

RUN npx prisma generate --schema src/prisma/schema.prisma
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./src/prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --schema src/prisma/schema.prisma && node dist/server.js"]
