# ImagineApps Frontend

Frontend para la plataforma ImagineApps desarrollada con Next.js, TypeScript y Shadcn UI.

## Descripción

ImagineApps es una plataforma para la gestión de eventos que permite a los usuarios crear, administrar y descubrir eventos. El frontend está construido con tecnologías modernas para ofrecer una experiencia de usuario fluida y atractiva.

## Tecnologías

- **Next.js 14**: Framework de React con renderizado híbrido
- **TypeScript**: Para tipado estático y mejor desarrollo
- **Shadcn UI**: Componentes de UI personalizables
- **API REST**: Integración con backend mediante API REST

## Requisitos previos

- Node.js 18.x o superior
- pnpm (recomendado) o npm
- Backend de ImagineApps corriendo en http://localhost:8000 (o la URL configurada)

## Configuración

### Variables de entorno

La aplicación utiliza una variable de entorno para configurar la URL del backend:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Para configurar esta variable:

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Añade la línea `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000` (o la URL correspondiente a tu backend)
3. Reinicia el servidor de desarrollo si ya estaba en ejecución

> **Nota**: Si no se proporciona esta variable, la aplicación usará por defecto `http://localhost:8000`

### Instalación

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

## Estructura del proyecto

```
imagineapps-frontend/
├── app/                  # Rutas y páginas (Next.js App Router)
│   ├── dashboard/        # Área privada para usuarios autenticados
│   ├── events/           # Páginas públicas de eventos
│   ├── login/            # Página de inicio de sesión
│   └── register/         # Página de registro
├── components/           # Componentes reutilizables
├── config/               # Configuraciones globales
│   └── env.ts            # Configuración de variables de entorno
├── context/              # Contextos de React (AuthContext, etc.)
├── public/               # Archivos estáticos
└── services/             # Servicios para API, autenticación, etc.
```

## Características principales

- **Autenticación**: Sistema completo con registro, inicio de sesión y gestión de sesión
- **Gestión de eventos**: Creación, edición y eliminación de eventos
- **Visualización de eventos**: Páginas públicas para visualizar eventos
- **Diseño responsivo**: Adaptable a diferentes tamaños de pantalla

## API Backend

La aplicación se comunica con un backend REST que debe estar corriendo y accesible en la URL especificada por `NEXT_PUBLIC_BACKEND_URL`. Todas las peticiones a la API utilizan esta variable de entorno para construir las URLs.

## Desarrollo

### Comandos útiles

```bash
# Ejecutar en modo desarrollo
pnpm dev

# Construir para producción
pnpm build

# Iniciar versión de producción
pnpm start

# Ejecutar linter
pnpm lint
```

## Despliegue

Para desplegar en producción, asegúrate de configurar la variable de entorno `NEXT_PUBLIC_BACKEND_URL` con la URL correcta de tu backend en producción.

```bash
# Ejemplo para Vercel
vercel --env NEXT_PUBLIC_BACKEND_URL=https://api.tudominio.com
```

## Contribuir

1. Clona el repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo [LICENSE] - ver el archivo LICENSE para más detalles.
