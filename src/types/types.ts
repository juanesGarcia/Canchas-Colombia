
export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
  phone?: string;
  state?: boolean;
}




export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  role: string;
  phone: string;
  courtName: string;
  courtAddress: string;
  courtCity: string;
  courtPhone: string;
  court_type: string;
  price: number;
  is_public: boolean;
  description?: string;
  state?: boolean;
  subcourts?: Subcourt[];
}

export interface Subcourt {
  id?:string;
  name: string;
  state: boolean;
}

export interface RegistrationDataService {
  courtName: string;
  courtAddress: string;
  courtCity: string;
  courtPhone: string;
  price: number;
  description: string;
  state: boolean;
  court_type: string;
  is_public:boolean;
  is_court: boolean; // Clave para identificar que es un servicio
}

export interface Court {
  court_id: string;
  court_name: string;
  user_id: string;
  owner_name: string;
  address: string;
  city: string;
  phone: string;
  court_type: string;
  is_public: boolean;
  default_price: number;
  description: string;
  price: number;
  state: boolean;
  subcourts: Subcourt[];
  court_prices: CourtPrice[]; // Define esta interfaz según tu tabla
  court_socials: CourtSocial[]; // Define esta interfaz según tu tabla
  photos: Photo[];
  is_court: boolean
}

export interface Photo {
  id: string;
  url: string;
}

export interface Service {
  court_id: string; // O service_id si tienes uno
  court_name: string;
  city: string;
  address: string;
  description: string;
  phone: string;
  court_prices: Array<{ price: number }>;
  photos: Array<{ id: string; url: string }>;
  state: boolean;
  // Agrega cualquier otra propiedad que un servicio pueda tener
}

export interface Post {
  post_id: string;
  user_id: string;
  user_name: string;
  title: string;
  content: string;
  state: boolean;
  created_at: string;
  updated_at: string;
  photos: Photo[];
}

export interface CourtPrice {
  id?: string;
  day_of_week: string; // Ejemplo: 'Lunes', 'Martes', 'Domingo'
  price: number;       // El precio en pesos
}

export interface CourtSocial {
  id?: string;
  platform: string; // Ejemplo: 'Facebook', 'Instagram', 'WhatsApp'
  url: string;      // La URL completa al perfil
}

// En tu archivo de tipos (ej. types.ts)
export interface LoginData {
  email: string;
  password: string;
}