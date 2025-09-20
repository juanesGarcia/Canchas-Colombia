// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthContextType, User } from "../types";
import { onLogin, onRegister, onLogout, onRegisterServices,onRegisterProveedor } from "../api/auth";
import { RegistrationData, RegistrationDataService,RegistrationDataProveedor } from "../types/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authDataString = localStorage.getItem("authData");
    if (authDataString) {
      try {
        const { token, user: storedUser } = JSON.parse(authDataString);
        if (storedUser && token) {
          // Asegúrate de que el objeto 'storedUser' también tenga el token
          // para cumplir con la interfaz 'User'
          const userWithToken = { ...storedUser, token };
          setUser(userWithToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        localStorage.removeItem("authData");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await onLogin({ email, password });
      const { token, info } = response;

      // Crea un nuevo objeto que combine la información del usuario y el token
      const userWithToken = { ...info, token };

      localStorage.setItem("authData", JSON.stringify({ token, user: info }));

      // Usa el nuevo objeto con el token para actualizar el estado
      setUser(userWithToken);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (userData: RegistrationData): Promise<boolean> => {
    try {
      const response = await onRegister(userData);
      console.log(response);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

    const registerProveedor = async (userData: RegistrationDataProveedor): Promise<boolean> => {
    try {
      const response = await onRegisterProveedor(userData);
      console.log(response);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const registerServices = async (userData: RegistrationDataService, userId: string): Promise<boolean> => {
    try {
      // Pasa el userId a la función de la API
      const response = await onRegisterServices(userData, userId);
      console.log(response);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };
  const logout = () => {
    onLogout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authData");

  };

  const value = { user, login, logout, isAuthenticated, register, registerServices,registerProveedor };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};