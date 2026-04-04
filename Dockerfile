FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy everything (including .env so Vite can pick up VITE_* vars)
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
