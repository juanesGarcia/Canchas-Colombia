
export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
  phone?: string;
  state?: boolean;
}

export interface UserUpdate {
  name: string;
  password?: string;
  email?:string;
}

export interface CourtUpdate {
  name: string;
  description: string;
  phone: string; 
  court_type: string;
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

export interface RegistrationDataProveedor {
  email: string;
  password: string;
  name: string;
  role: string;
  phone: string;
}

export interface ReservationData {
  user_id: string;
  user_name: string;
  phone: string;
  subcourt_id: string; 
  reservation_date: string;
  reservation_time: string;
  duration: number; 
  price_reservation: number;   
  transfer: number;
  state:boolean;
  payment_method: 'transferencia' | 'tarjeta' | 'efectivo' | 'pending' | string;

}


export interface Subcourt {
  id:string;
  subcourt_name: string;
  state: boolean;
  subcourt_id:string;
}


export interface SubCourtPrice {
    id: string;
    name: string;
    state: boolean;
    day_of_week:string;
    price: number;
}
export interface SubcourtAdd{
  id:string;
  name: string;
  state: boolean;
  subcourt_id:string;
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
  is_court: boolean; // Clave para identificar que es un servicio
}

export interface RegistrationDataPromotion {
  name: string;
  phone: string;
  price: number;
  description: string;
  state: boolean;
  is_public:boolean;
  type: string; // Clave para identificar que es un servicio
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
  type: string;
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
  photos: Photo[];
  state: boolean;
  price: number;
  court_type: string;
  type: string;
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
    price: { 
        [key: string]: number;
    };     // El precio en pesos
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

export interface RegistrationSubCourt {
  name:string;
  state:boolean;
}
export interface RegisterResponse {
  success: boolean;
  message: string;
  user: string;
  promotionId: string;
}


export interface Reservation {
  reservation_id: string;
  reservation_date: string;
  reservation_time: string;
  duration: number;
  end_time: string;
  state: string;
  price_reservation: number;
  transfer: boolean;
  client_name: string;
  client_phone: string;
  subcourt_id: string;
  subcourt_name: string;
  court_id: string;
  court_name: string;
}


export interface UseReservationsResult {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}