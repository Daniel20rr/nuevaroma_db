FROM node:18-bullseye AS build

WORKDIR /app

# ============================================================
# 🔧 CONFIGURAR NPM PARA MAYOR ESTABILIDAD Y TIMEOUTS
# ============================================================
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 300000 && \
    npm config set registry https://registry.npmjs.org/

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos Angular CLI globalmente
RUN npm install -g @angular/cli@15.2.10

# ============================================================
# 📦 INSTALACIÓN DE DEPENDENCIAS CON REINTENTOS
# ============================================================
# Intentamos instalar, si falla reintentamos automáticamente
RUN npm install --legacy-peer-deps || \
    (echo "Primer intento falló, reintentando..." && npm install --legacy-peer-deps)

# Copiamos el código fuente
COPY . .

# ============================================================
# 🏗️ BUILD DE PRODUCCIÓN
# ============================================================
RUN ng build --configuration production

# ============================================================
# 🚀 ETAPA DE RUNTIME CON NGINX (Más eficiente que http-server)
# ============================================================
FROM nginx:alpine AS runtime

WORKDIR /usr/share/nginx/html

# Removemos los archivos por defecto de nginx
RUN rm -rf ./*

# Copiamos la app compilada desde la etapa de build
# Copiamos todo el contenido de dist (sin importar el nombre de la carpeta)
COPY --from=build /app/dist ./

# Copiamos configuración personalizada de nginx (opcional pero recomendado)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 (estándar de nginx)
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]