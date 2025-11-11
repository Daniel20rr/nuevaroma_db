# ======================
# Stage 1: Build Angular App
# ======================
FROM node:18-bullseye AS build

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos Angular CLI y el devkit necesarios para compilar Angular 15
RUN npm install -g @angular/cli@15.2.10
RUN npm install --legacy-peer-deps

# Copiamos el resto del proyecto
COPY . .

# Compilamos la aplicación
RUN npx ng build --configuration production

# ======================
# Stage 2: Runtime server
# ======================
FROM node:18-slim AS runtime
WORKDIR /app

RUN npm install -g http-server

COPY --from=build /app/dist /app/dist

EXPOSE 4200
CMD ["http-server", "/app/dist", "-p", "4200", "-c-1"]
