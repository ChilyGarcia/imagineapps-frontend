// Archivo de configuración para variables de entorno

// URL del backend (se usa NEXT_PUBLIC para que esté disponible en el cliente)
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
