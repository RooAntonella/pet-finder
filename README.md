# Pet Finder 🐾

Webapp Full Stack desarrollada como desafío del módulo 7 de la carrera de Desarrollo Web Full Stack de APX.

Pet Finder permite reportar mascotas perdidas, encontrar mascotas reportadas cerca de la ubicación del usuario y enviar información sobre avistamientos a sus dueños.

## Links

- **Webapp:** https://pet-finder-web-frwz.onrender.com
- **API:** https://pet-finder-z9ep.onrender.com
- **Documentación de Postman:** https://documenter.getpostman.com/view/57888630/2sBYPwWrDo

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Autenticación mediante JWT.
- Modificación de datos personales y contraseña.
- Publicación, edición y eliminación de reportes de mascotas.
- Carga de imágenes.
- Selección de ubicación mediante un mapa interactivo.
- Búsqueda de mascotas perdidas dentro de un radio de 5 km.
- Cambio de estado de mascotas perdidas a encontradas.
- Reporte de avistamientos y notificaciones por email.

## Tecnologías utilizadas

### Backend

- Node.js
- Express
- TypeScript
- Sequelize
- PostgreSQL (Neon)
- JWT
- Argon2

### Frontend

- TypeScript
- Vite
- HTML y CSS
- Leaflet
- OpenStreetMap

### Servicios externos

- Cloudinary: almacenamiento de imágenes.
- Algolia: búsqueda geográfica mediante aroundLatLng y aroundRadius.
- Resend: envío de notificaciones por email.
- Render: despliegue del frontend y backend.

## Arquitectura

El backend está organizado siguiendo la arquitectura MVC, separando modelos, controladores, rutas, servicios y middlewares.

El frontend está organizado en páginas, componentes reutilizables, servicios, router y estado de sesión.

Ambos proyectos se encuentran dentro del mismo repositorio, en las carpetas backend y frontend.

## Consideraciones

Las credenciales de los servicios externos se administran mediante variables de entorno y no están incluidas en el repositorio.

Resend se encuentra configurado en modo de prueba, por lo que las notificaciones por email solo pueden enviarse al destinatario autorizado.

El backend está alojado en el plan gratuito de Render, por lo que la primera petición puede demorar si el servicio se encuentra inactivo.
