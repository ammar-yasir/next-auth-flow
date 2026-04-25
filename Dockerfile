# 1. Base
FROM node:20-slim AS base
WORKDIR /app

# 2. Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 3. Build
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# ✅ IMPORTANT: generate Prisma client BEFORE build
# IMPORTANT: ensure correct Prisma engine
RUN npx prisma generate

RUN npm run build

# 4. Production image
# runtime
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update -y \
  && apt-get install -y openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# non-root user
RUN groupadd -g 1001 nodejs \
  && useradd -u 1001 -g nodejs -s /bin/sh -m nextjs

COPY --from=builder /app ./

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]