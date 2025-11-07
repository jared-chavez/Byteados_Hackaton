# XpressUTC - Cafetería Escolar

Sistema de cafetería escolar con pagos en línea para la Universidad Tecnológica de Coahuila.

## Estructura del Proyecto

- `api/` - Backend Laravel (API REST)
- `api-client/` - Frontend React con Vite

## Configuración

### Variables de Entorno

Los archivos `.env` están centralizados en la raíz del proyecto y se comparten entre `api` y `api-client`.

El archivo `.env` en `api/` es un enlace simbólico que apunta a `.env` en la raíz.

### Puertos

- **Backend (Laravel)**: `http://localhost:8000`
- **Frontend (Vite)**: `http://localhost:3000`

El frontend está configurado para hacer proxy de las peticiones `/api` al backend en el puerto 8000.

## Instalación

### Backend (API)

```bash
cd api
composer install
php artisan key:generate
php artisan migrate
npm install
```

### Frontend (API Client)

```bash
cd api-client
npm install
```

## Desarrollo

### Opción 1: Iniciar todo desde la raíz (Recomendado)

```bash
# Instalar dependencias de ambos proyectos
npm run install:all

# Iniciar backend y frontend simultáneamente
npm run dev
```

### Opción 2: Iniciar por separado

#### Iniciar Backend

```bash
cd api
composer run dev
```

Esto iniciará:
- Servidor Laravel en el puerto 8000
- Queue listener
- Pail (logs)
- Vite para assets

#### Iniciar Frontend

```bash
cd api-client
npm run dev
```

Esto iniciará el servidor de desarrollo en el puerto 3000.

### Scripts Disponibles

Desde la raíz del proyecto:

- `npm run dev` - Inicia backend y frontend simultáneamente
- `npm run dev:api` - Inicia solo el backend
- `npm run dev:client` - Inicia solo el frontend
- `npm run install:all` - Instala dependencias de ambos proyectos
- `npm run setup` - Configuración inicial completa del proyecto

## Variables de Entorno Importantes

- `APP_URL`: URL del backend (http://localhost:8000)
- `VITE_API_URL`: URL del backend para el frontend (http://localhost:8000)
- `VITE_PORT`: Puerto del servidor de desarrollo del frontend (3000)
