# Dockerfile optimizado para Hugging Face Spaces (16GB RAM)
FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código
COPY . .

# Compilar Next.js (Aquí los 16GB de RAM de Hugging Face harán que vuele)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Hugging Face usa el puerto 7860 por defecto
ENV PORT=7860
EXPOSE 7860

# Dar permisos a la carpeta de perfiles para que el bot pueda escribir
RUN mkdir -p tmp-profiles && chmod -R 777 tmp-profiles

# Comando de arranque ajustado al puerto de HF
CMD ["npx", "next", "start", "-p", "7860"]
