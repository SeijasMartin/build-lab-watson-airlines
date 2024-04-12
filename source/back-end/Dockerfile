# Usa una imagen base de Node.js
FROM node:current-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de la aplicación
COPY . .

# Instala las dependencias de la aplicación
RUN npm install

# Install the node SDK
RUN npm install ibm-watson

# instala el dotenv para .env
RUN npm install dotenv

# Ejecuta la aplicación al iniciar el contenedor
CMD [ "node", "app.js" ]
