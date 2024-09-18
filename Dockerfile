# Étape 1: Build
FROM 192.168.1.70:8082/node:20.16.0-slim AS build

# Définir le répertoire de travail dans l'image temporaire
WORKDIR /app

# Copier les fichiers de projet dans l'image temporaire
COPY . .

# Installer les dépendances et pnpm
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Compiler le projet
RUN pnpm build

# Étape 2: Production
FROM 192.168.1.70:8082/node:20.16.0-slim

# Définir le répertoire de travail dans l'image finale
WORKDIR /app

# Installer pnpm dans l'image finale
RUN npm install -g pnpm

# Copier tout le répertoire dist
COPY --from=build /app/dist ./dist

# Copier les fichiers package.json et node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

# Copier les fichiers de templates d'emails
COPY --from=build /app/src/email/templates ./src/email/templates

# Définir la commande par défaut pour démarrer l'application
CMD ["pnpm", "start:prod"]