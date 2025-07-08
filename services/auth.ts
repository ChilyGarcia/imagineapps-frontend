// services/auth.ts
// Servicio para manejo de autenticación y token JWT

/**
 * Tipo para la respuesta del login
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

/**
 * Tipo para datos de usuario autenticado
 */
export interface UserData {
  username: string;
  [key: string]: any; // Otros campos que pueda tener el usuario
}

const API_URL = "http://127.0.0.1:8000";

/**
 * Servicio de autenticación para manejar login y token JWT
 */
export const AuthService = {
  /**
   * Iniciar sesión con username y password
   */
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || "Error al iniciar sesión. Verifica tus credenciales."
      );
    }

    const data = await response.json();
    
    // Guardar el token en localStorage
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("token_type", data.token_type);
    
    return data;
  },

  /**
   * Cerrar la sesión (eliminar token)
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_type");
  },

  /**
   * Verificar si hay un usuario autenticado (token existe)
   */
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },

  /**
   * Obtener el token de autenticación
   */
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  /**
   * Obtener el header de autorización para peticiones autenticadas
   */
  getAuthHeader: (): HeadersInit => {
    const token = AuthService.getToken();
    if (!token) return {};
    
    const tokenType = localStorage.getItem("token_type") || "bearer";
    return {
      Authorization: `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${token}`,
    };
  },

  /**
   * Hacer una petición autenticada con el token JWT
   */
  fetchWithAuth: async (url: string, options: RequestInit = {}): Promise<any> => {
    const headers = {
      ...options.headers,
      ...AuthService.getAuthHeader(),
    };

    const response = await fetch(url.startsWith('http') ? url : `${API_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `Error en la petición: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Obtener datos del usuario actual autenticado
   * Nota: Debes adaptar esto a tu API específica
   */
  getCurrentUser: async (): Promise<UserData> => {
    return AuthService.fetchWithAuth('/users/me');
  }
};
