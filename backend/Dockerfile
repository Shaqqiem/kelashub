FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

EXPOSE 4000
CMD ["node","src/index.js"]

