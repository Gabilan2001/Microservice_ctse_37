# Multi-stage: Node builds static files; final image is nginx:alpine only (small runtime).
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .

# Single entry point (nginx api-gateway). Unset at build time to use REACT_APP_* per-service URLs instead.
ARG REACT_APP_API_GATEWAY_URL=http://localhost:8080
ENV REACT_APP_API_GATEWAY_URL=$REACT_APP_API_GATEWAY_URL

RUN npm run build

FROM nginx:alpine AS runner

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
