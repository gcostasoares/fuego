# Basis-Image mit Node.js
FROM node:18-alpine

# Arbeitsverzeichnis
WORKDIR /app

# Paket-Definitionen kopieren und Dependencies installieren
COPY package*.json ./
RUN npm ci --only=production

# Restlichen Code kopieren
COPY . .

# Umgebungsvariablen vorbelegen
ENV PORT=8081

# Port freigeben
EXPOSE 8081

# Server starten (ggf. anpassen, falls deine Einstiegsdatei anders heißt)
CMD ["node", "server.js"]
