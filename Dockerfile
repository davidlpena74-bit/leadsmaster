# --- ESTA ES LA VERSIÓN ULTRA-LIGERA PARA KOYEB FREE ---

# 1. Compilación (Imagen pequeña de 20MB en lugar de 700MB)
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
# Forzamos a Next.js a no usar mucha RAM en el build
ENV NODE_OPTIONS="--max-old-space-size=450"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

# 2. Ejecución (Aquí sí necesitamos Playwright)
FROM mcr.microsoft.com/playwright:v1.49.0-noble AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

# Copiamos solo lo necesario del builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts

EXPOSE 8000

# Arrancamos con límite de memoria para evitar que Koyeb mate el proceso
CMD ["node", "--max-old-space-size=200", "node_modules/next/dist/bin/next", "start", "--port", "8000"]
