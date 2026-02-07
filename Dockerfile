# --- STAGE 1: Build ---
FROM node:20-slim AS builder
WORKDIR /app

# Instalar dependencias necesarias para compilar Next.js
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar
COPY . .
RUN npm run build

# --- STAGE 2: Runner ---
FROM mcr.microsoft.com/playwright:v1.49.0-noble AS runner
WORKDIR /app

# Establecer entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Instalar solo lo esencial para ejecutar la app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts

# Exponer el puerto que usa Koyeb
EXPOSE 8000
ENV PORT=8000

# Comando para arrancar la app
# Nota: Koyeb usará este puerto para el Dashboard
CMD ["npm", "run", "start"]
