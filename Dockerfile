# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Dependencies
#   Install ALL dependencies (including devDependencies needed for build)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Builder
#   Run TypeScript check + Vite production build
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build the Vite app — outputs to /app/dist
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — Runner (Nginx)
#   Serve the static dist/ folder with Nginx — tiny production image
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
