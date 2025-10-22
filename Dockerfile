# ---------- deps layer ----------
FROM node:20-alpine AS deps
WORKDIR /app
# Needed for Prisma/Next on Alpine (musl)
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- build layer ----------
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1

# bring in node_modules first (speeds up)
COPY --from=deps /app/node_modules ./node_modules
# copy source
COPY . .

# Generate Prisma client BEFORE Next build so types exist
RUN npx prisma generate
# Build Next.js
RUN npm run build

# ---------- runtime layer ----------
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production

# copy only what runtime needs
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
# include env so Prisma can find SQLite
COPY .env ./.env

EXPOSE 3000
CMD ["npm", "start"]
