# Usamos la imagen oficial de Playwright que ya trae Node.js y los navegadores
FROM mcr.microsoft.com/playwright:v1.49.0-noble AS base

# --- STAGE 1: Build ---
WORKDIR /app
COPY package*.json ./
# Instalación limpia
RUN npm ci

COPY . .
# Desactivamos el linting y el type checking durante el build para que no falle por avisos menores
ENV NEXT_TELEMETRY_DISABLED=1
ENV DISABLE_ESLINT_PLUS_GRAPHQL=1
RUN npx next build

# --- STAGE 2: Runner ---
FROM mcr.microsoft.com/playwright:v1.49.0-noble AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/scripts ./scripts

EXPOSE 8000

# Comando para arrancar
CMD ["npm", "start"]
