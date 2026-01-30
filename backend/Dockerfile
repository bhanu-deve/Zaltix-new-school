# ---------- Dependencies stage ----------
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force


# ---------- Runtime stage ----------
FROM node:18-alpine
WORKDIR /app

# 🔴 ADD THIS LINE (FIX)
RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy app source
COPY . .

# Fix ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "index.js"]
