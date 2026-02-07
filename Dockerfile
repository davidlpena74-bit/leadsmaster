# 1. Etapa de Construcción (Ligera)
FROM node:20-slim AS builder
WORKDIR /app

# Instalamos dependencias de sistema mínimas para compilar
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# Instalación normal
RUN npm install --no-audit --no-fund

COPY . .
# Forzamos ahorro de RAM en el build de Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=400"
RUN npx next build

# 2. Etapa de Ejecución (Solo instalamos Chromium cuando sea necesario)
FROM node:20-slim AS runner
WORKDIR /app

# Instalamos las librerías necesarias para que Chrome funcione en Linux
RUN apt-get update && apt-get install -y \
    libgbm1 libnss3 libasound2 libxss1 libatk-bridge2.0-0 libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=8000

# Copiamos los archivos compilados del builder
COPY --from=builder /app ./

# Instalamos solo el navegador Chromium de Playwright (ahorra 1GB de espacio frente a la imagen completa)
RUN npx playwright install chromium

EXPOSE 8000

# Arrancamos con límite de memoria para evitar que Koyeb mate el proceso
CMD ["node", "--max-old-space-size=200", "node_modules/next/dist/bin/next", "start", "--port", "8000"]
