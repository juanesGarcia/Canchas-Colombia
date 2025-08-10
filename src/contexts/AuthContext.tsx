import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, User } from "../types";

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
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        //setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulación de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Usuario demo
    const mockUser: User = {
      id: "user-1",
      name: email === "admin@sportspace.com" ? "Admin" : "Usuario Demo",
      email,
      role: email === "admin@sportspace.com" ? "admin" : "user",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return true;
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // Simulación de registro
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "user",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
