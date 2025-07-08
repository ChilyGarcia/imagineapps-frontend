"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthService, UserData } from "@/services/auth";

// Define los tipos para el contexto de autenticación
interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verificar el estado de autenticación al iniciar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          // Si tenemos token, intentamos obtener los datos del usuario
          try {
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);
          } catch (err) {
            // Si falla, es porque el token no es válido o expiró
            AuthService.logout();
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error("Error al verificar autenticación:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await AuthService.login(username, password);
      
      // Intentar obtener datos del usuario después del login
      try {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      } catch (userErr) {
        console.warn("No se pudieron obtener datos del usuario:", userErr);
        // Creamos un usuario básico si no podemos obtener sus datos
        setUser({ username });
      }
      
      setIsAuthenticated(true);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
