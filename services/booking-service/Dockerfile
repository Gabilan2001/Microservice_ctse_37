FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8081

COPY --from=deps /app/node_modules ./node_modules

COPY . .

EXPOSE 8081

CMD ["node", "src/server.js"]
