# Usamos una imagen de Node.js como base
FROM node:14

# Establecemos el directorio de trabajo en /app
WORKDIR /app

# Copiamos los archivos del frontend
COPY . .

# Instalamos las dependencias
RUN npm install

# Construimos la aplicación React
RUN npm run build

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
