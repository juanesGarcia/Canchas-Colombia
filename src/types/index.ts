import {
  RegistrationData
} from '../types/types.ts';

export interface Field {
  id: string;
  name: string;
  type: "football" | "basketball" | "tennis" | "volleyball";
  price: number;
  capacity: number;
  available: boolean;
  isPublic: boolean;
  image: string;
  description: string;
  features: string[];
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    address: string;
  };
}

export interface navigateElement {
  name: string;
  path: string;
  public?: boolean;
  icon?: JSX.Element | JSX.Element[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  icon: string;
  image: string;
  features: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "superadmin";
  avatar?: string;
  token: string; 
}

export interface Booking {
  id: string;
  fieldId: string;
  userId: string;
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
 register: (data: RegistrationData) => Promise<boolean>; 
  logout: () => void;
  isAuthenticated: boolean;
}
