import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, User } from "../types";
import { onLogin } from "../api/auth"; // Asegúrate de importar tus funciones de API

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Intenta cargar el usuario y el token del localStorage al inicio
    const authDataString = localStorage.getItem("authData");
    if (authDataString) {
      try {
        const { token, user: storedUser } = JSON.parse(authDataString);
        if (token && storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        localStorage.removeItem("authData");
      }
    }
  }, []);

  // La función login ahora acepta los datos de login y llama a la API
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await onLogin({ email, password });
      
      const { token, info} = response;

      // Guarda el token y los datos del usuario en el localStorage
      localStorage.setItem("authData", JSON.stringify({ token, user: info }));
      setUser(user);
      setIsAuthenticated(true);
      return true;

    } catch (error) {
      console.error("Login failed:", error);
      // Opcional: manejar errores de la API aquí
      return false;
    }
  };


  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authData"); // Elimina toda la data de autenticación
  };


  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};