# ---------- Dependencies stage ----------
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./


RUN npm ci --only=production && npm cache clean --force



FROM node:18-alpine
WORKDIR /app


ENV NODE_ENV=production
ENV PORT=3000


RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001


COPY --from=deps /app/node_modules ./node_modules


COPY . .

# Fix ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# 🚀 Start application ONLY
CMD ["node", "index.js"]
