# Utiliza la imagen base de Nginx
FROM nginx:latest

# Copia los archivos HTML y CSS al directorio de Nginx
COPY index.html /usr/share/nginx/html
COPY styles.css /usr/share/nginx/html

# Exponer el puerto 80 para que Nginx pueda servir el contenido
EXPOSE 80
