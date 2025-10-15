import axios from 'axios';
import {
  User,
  RegistrationData,
  Court,
  Post,
  Photo,
  LoginData, 
  RegistrationDataService,
  ReservationData,
  Subcourt,
  Service,
  RegistrationSubCourt,
  RegistrationDataProveedor,
  SubcourtAdd,
  SubCourtPrice,
  UserUpdate,
  CourtUpdate,
  Reservation,
  RegistrationDataPromotion,
  RegisterResponse

} from '../types/types.ts';
import { format } from 'date-fns';
axios.defaults.withCredentials = true;

const backendUrl = 'http://localhost:3000';

interface GetCourtsResponse {
  success: boolean;
  courts: Court[];
}

interface UserReservationsResponse {
    success: boolean;
    message: string;
    reservations: Reservation[]; // La clave correcta del backend es 'reservations'
}

interface GetServicesDetailResponse {
  success: boolean;
  court: Service;
}

interface LoginResponse {
  token: string;
  info: User; 
  success:boolean;

}

interface GetSubcourtsResponse {
  success: boolean;
  subcourts: Subcourt[]; // El backend ahora devuelve directamente este campo
}

interface GetSubcourtsResponsePrice {
  success: boolean;
  subcourts: SubCourtPrice[]; // El backend ahora devuelve directamente este campo
}

interface GetSubcourtResponse {
  success: boolean;
  subcourt: Subcourt; // El backend ahora devuelve directamente este campo
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

/** 1. Reserva por Día de la Semana */
interface ReservationDay {
    dia_semana: string;
    total_reservas: number;
}

/** 2. Total de Reservas por Hora */
interface ReservationHour {
    hora_inicio: string;
    total_reservas: number;
}

/** 3. Horarios Pico y Valle */
interface PeakOffPeakHour {
    tipo: 'hot' | 'cold'; // 'hot' (pico) o 'cold' (valle)
    hora: string; // Hora en formato HH24 (ej. "18")
    total_reservas: number;
}

/** 4. Reservas Periódicas (Semana, Mes, Año) */
export interface PeriodicReservation {
    ano: string;
    mes_nombre: string;
    mes_numero: string;
    total_reservas: string; // La API devuelve '3' (string), así que lo mantenemos como string por seguridad.
}
/** 5. Clientes Frecuentes */
interface FrequentClient {
    user_id: string;
    user_name: string;
    total_reservas: number;
}

/** 6. Recaudo por Método de Pago (Filtrado por Subcancha) */
interface RevenueByPaymentMethod {
    payment_method: string; // Puede ser un método o 'Total General'
    total_reservas: number;
    recaudo_total: string; // O number, dependiendo de cómo manejes la moneda
}

/** 7. Recaudo Detallado por Subcancha y Método de Pago (NUEVO) */
interface DetailedRevenue {
    metodo_pago: string; // Método de pago o 'TOTAL GENERAL'
    total_reservas: number;
    recaudo_total: string; // O number, dependiendo de cómo manejes la moneda
}


export async function onRegister(registrationData: RegistrationData) {
  return await axios.post(`${backendUrl}/register`, registrationData);
}

export async function onRegisterProveedor(registrationData: RegistrationDataProveedor) {
    const response = await axios.post<RegisterResponse>(`${backendUrl}/registerProveedor`, registrationData);
   return response.data;
}

export async function onRegisterPromotions(registrationData: RegistrationDataPromotion , userId:string) {
  const response = await axios.post<RegisterResponse>(`${backendUrl}/registerPromotions/${userId}`, registrationData);
   return response.data;
}

export async function onReservationRegister(registrationData: ReservationData, subcourtId: string) {
  try {
    const response = await axios.post(`${backendUrl}/reservations/${subcourtId}`, registrationData);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error('Error al registrar la reserva:', error);
    throw error;
  }
}

export async function onRegisterServices(registrationData: RegistrationDataService, userId:string) {
    const response = await axios.post<RegisterResponse>(`${backendUrl}/registerServices/${userId}`, registrationData);
   return response.data;
}



// Inicio de sesión
export async function onLogin(loginData: LoginData) {
  // Aquí solo especificas el tipo de la respuesta (LoginResponse)

    const response = await axios.post<LoginResponse>(`${backendUrl}/login`, loginData);
    return response.data;

}
// Cierre de sesión
export async function onLogout() {
  return await axios.get(`${backendUrl}/logout`);
}

export async function getUsers(): Promise<User[]> {
  const response = await axios.get<User[]>(`${backendUrl}/users`);
  return response.data;
}

export async function getReservationsBySubcourtAndDate(subcourtId: string, date: Date): Promise<Reservation[]> {
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  // Use a GET request and pass the date as a URL query parameter
  const response = await axios.get<{ reservations: Reservation[] }>(
    `${backendUrl}/ReservationDate/${subcourtId}?reservationDate=${formattedDate}`
  );
  
  return response.data.reservations;
}

// Obtener un usuario por su ID
export async function getUser(id: string): Promise<User> {
  const response = await axios.get(`${backendUrl}/user/${id}`);
  return response.data as User; // Le dices a TypeScript: "confía en mí, esto es un User"
}
// Actualizar un usuario
export async function onUpdateUser(updateData: { id: string; userData: UserUpdate; token: string }) {
  return await axios.put(`${backendUrl}/user/${updateData.id}`, updateData.userData, {
    headers: {
      'Authorization': `Bearer ${updateData.token}`,
      'Content-Type': 'application/json'
    }
  });
}

export const updateSubCourt = async (subcourtId: string, data: Partial<SubCourtPrice>) => {
    try {
        const response = await axios.put(`${backendUrl}/subcourtPrice/${subcourtId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating subcourt:', error);
        throw error;
    }
};


// Eliminar un usuario
export async function onDeleteUser(data: { id: string; token: string }) {
  return await axios.delete(`${backendUrl}/user/${data.id}`, {
    headers: {
      'Authorization': `Bearer ${data.token}`,
      'Content-Type': 'application/json'
    }
  });
}

// --- Rutas de Canchas ---

// Obtener todas las canchas
export async function getCourts(): Promise<Court[]> {
  const response = await axios.get<GetCourtsResponse>(`${backendUrl}/courts`);
  console.log(response.data.courts);
  return response.data.courts;
}

export async function getPromotionsByUserId(id: string): Promise<Court[]> {
  console.log(id)
  const response = await axios.get<GetCourtsResponse>(`${backendUrl}/getPromotions/${id}`);
  console.log(response)
  return response.data.courts
}

export async function getSubCourtPrice(id: string): Promise<SubCourtPrice[]> {
    try {
        const response = await axios.get<SubCourtPrice[]>(`${backendUrl}/subcourtPrice/${id}`);
        
        // Log the data directly, not the `subcourts` property.
        console.log(response.data);
        
        // The data is the array you need, so return it directly.
        return response.data;
    } catch (error) {
        console.error("Error al obtener el precio de la subcancha:", error);
        throw error;
    }
}

export async function getServices(): Promise<Court[]> {
  const response = await axios.get<GetCourtsResponse>(`${backendUrl}/services`);
  console.log(response.data.courts);
  return response.data.courts;
}
export async function getSubcourtsByUserId(userId: string): Promise<Subcourt[]> {
  try {
    const response = await axios.get<GetSubcourtsResponse>(`${backendUrl}/subCourts/${userId}`);

    console.log('Respuesta de la API para subcanchas:', response.data);

    // FIX: Extrae el array de subcanchas del objeto 'court'
    
    const fetchedSubcourts = response.data.subcourts || [];
    if (response.data.success && Array.isArray(fetchedSubcourts)) {
      return fetchedSubcourts;
    } else {
      console.error("La respuesta de la API no contiene un array de subcanchas válido.");
      return [];
    }
  } catch (error) {
    console.error("Error al obtener subcanchas por ID de usuario:", error);
    throw error;
  }
}
// Actualizar una cancha
export async function onUpdateCourt(updateData: { id: string; fieldData : CourtUpdate; token: string }) {
  return await axios.put(`${backendUrl}/courts/${updateData.id}`, updateData.fieldData, {
    headers: {
      'Authorization': `Bearer ${updateData.token}`,
      'Content-Type': 'application/json'
    }
  });
}

// Subir imágenes y actualizar la descripción de una cancha
export async function onUploadImages(uploadData: { id:string; files: File[]}) {
  const formData = new FormData();
  uploadData.files.forEach(file => {
    formData.append('photo', file);
  });

  return await axios.post(`${backendUrl}/upload/${uploadData.id}`, formData);
}

export async function onUploadImagesServices(uploadData: { id:string; files: File[]}) {
  const formData = new FormData();
  uploadData.files.forEach(file => {
    formData.append('photo', file);
  });

  return await axios.post(`${backendUrl}/uploadServices/${uploadData.id}`, formData);
}

// Obtener las imágenes de un usuario específico
export async function getImages(id: string) {
  return await axios.get(`${backendUrl}/getImages/${id}`);
}

// Eliminar una imagen de una cancha
export async function onDeleteImage(data: { courtId: string; photoId: string; token: string }) {
  return await axios.delete(`${backendUrl}/deleteImages/${data.courtId}/${data.photoId}`, {
    headers: {
      'Authorization': `Bearer ${data.token}`
    }
  });
}

export async function deletePromotionById(data: { courtId: string; token: string }) {
  return await axios.delete(`${backendUrl}/courts/${data.courtId}`, {
    headers: {
      'Authorization': `Bearer ${data.token}`
    }
  });
}

// --- Rutas de Posts ---

// Crear un nuevo post
export async function onCreatePost(postData: { title: string; content: string; files?: File[]; token: string }) {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);
  if (postData.files) {
    postData.files.forEach(file => {
      formData.append('post_images', file);
    });
  }

  return await axios.post(`${backendUrl}/post`, formData, {
    headers: {
      'Authorization': `Bearer ${postData.token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
}

// Obtener todos los posts
export async function getPosts(): Promise<Post[]> {
  const response = await axios.get<Post[]>(`${backendUrl}/posts`);
  return response.data;
}

// Obtener un post específico por su ID
export async function getPostById(id: string): Promise<Post> {
  const response = await axios.get<Post>(`${backendUrl}/post/${id}`);
  return response.data;
}

// Actualizar un post
export async function onUpdatePost(updateData: { id: string; postData: Partial<Post>; token: string }) {
  return await axios.put(`${backendUrl}/post/${updateData.id}`, updateData.postData, {
    headers: {
      'Authorization': `Bearer ${updateData.token}`,
      'Content-Type': 'application/json'
    }
  });
}

// Eliminar un post
export async function onSubCourt(id: string, RegistrationSubCourt: RegistrationSubCourt, token: string): Promise<Subcourt> {
  try {
    const response = await axios.post<GetSubcourtResponse>(
      `${backendUrl}/subcourt/${id}`,
      RegistrationSubCourt,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log(response.data.subcourt);
    return response.data.subcourt;
  } catch (error) {
      console.error("Error inesperado:", error);
      throw new Error("Error inesperado al crear la subcancha");
    }
  }


// --- Rutas de Localización ---

// Actualizar la localización del usuario
export async function onUpdateLocation(data: { id: string; latitude: number; longitude: number }) {
  return await axios.post(`${backendUrl}/updatelocation`, data);
}


export async function getCourtById(id: string): Promise<Service>{
  const response = await axios.get<GetServicesDetailResponse>(`${backendUrl}/courts/${id}`);
  console.log(response.data.court);
  return response.data.court;
}


export async function deleteSubcourt(subcourtId: string, token : string): Promise<boolean> {
    try {
        const response = await axios.delete<DeleteResponse>(`${backendUrl}/subcourts/${subcourtId}`,{
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
        // We return true if the API indicates a successful deletion.
        return response.data.success;
    } catch (error) {
        console.error("Error deleting subcourt:", error);
        // Return false to indicate that the deletion failed.
        return false;
    }
}

export async function getUserReservation(id: string): Promise<Reservation[]>{
  const response = await axios.get<UserReservationsResponse>(`${backendUrl}/userCourts/${id}`);
  console.log(response.data);
  return response.data.reservations;
}

/**
 * 1. Obtiene el total de reservas agrupadas por día de la semana.
 * @param id El ID de la subcancha para filtrar.
 */
export async function getReservationsByDay(id: string): Promise<ReservationDay[]> {
    try {
        const response = await axios.get<ReservationDay[]>(`${backendUrl}/analytics/reservationsDays/${id}`);
        console.log("Reservas por Día:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener reservas por día:", error);
        throw error;
    }
}

/**
 * 2. Obtiene el total de reservas agrupadas por hora de inicio.
 * @param id El ID de la subcancha para filtrar.
 */
export async function getReservationsByHour(id: string): Promise<ReservationHour[]> {
    try {
      console.log(id);
        const response = await axios.get<ReservationHour[]>(`${backendUrl}/analytics/reservationsHours/${id}`);
        console.log("Reservas por Hora:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener reservas por hora:", error);
        throw error;
    }
}

/**
 * 3. Identifica la hora pico ('hot') y la hora valle ('cold') de reservas.
 * @param id El ID de la subcancha para filtrar.
 */
export async function getPeakOffPeakHours(id: string): Promise<PeakOffPeakHour[]> {
    try {
        const response = await axios.get<PeakOffPeakHour[]>(`${backendUrl}/analytics/HotCold/${id}`);
        console.log("Horarios Pico/Valle:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener horarios pico y valle:", error);
        throw error;
    }
}

/**
 * 4. Obtiene el histórico de reservas agrupadas por semana, mes y año.
 * @param id El ID de la subcancha para filtrar.
 */
export async function getPeriodicReservations(id: string): Promise<PeriodicReservation[]> {
    try {
        const response = await axios.get<PeriodicReservation[]>(`${backendUrl}/analytics/periodicReservations/${id}`);
        console.log("Reservas Periódicas:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener reservas periódicas:", error);
        throw error;
    }
}

/**
 * 5. Obtiene la lista de los 10 clientes con más reservas.
 * @param id El ID de la subcancha para filtrar.
 */
export async function getFrequentClients(id: string): Promise<FrequentClient[]> {
    try {
        const response = await axios.get<FrequentClient[]>(`${backendUrl}/analytics/frequentClients/${id}`);
        console.log("Clientes Frecuentes:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener clientes frecuentes:", error);
        throw error;
    }
}

/**
 * 6. Obtiene el recaudo y total de reservas agrupado por método de pago para una subcancha específica.
 * @param id El ID de la subcancha para filtrar.
 */
export async function getRevenueByPaymentMethod(id: string): Promise<RevenueByPaymentMethod[]> {
    try {
        // Asumiendo que el endpoint es: /analytics/revenuePayment/:id
        const response = await axios.get<RevenueByPaymentMethod[]>(`${backendUrl}/analytics/revenuePayment/${id}`);
        console.log("Recaudo por Método de Pago:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener recaudo por método de pago:", error);
        throw error;
    }
}

// ====================================================================
// FUNCIÓN ADICIONAL (Para el endpoint detallado que creamos previamente)
// ====================================================================

/**
 * 7. Obtiene el recaudo detallado por subcancha y método de pago (si tu router lo implementa).
 * @param id El ID de la subcancha para filtrar.
 */
export async function getDetailedRevenue(id: string): Promise<DetailedRevenue[]> {
    try {
        // Utilizando un nombre de endpoint sugerido basado en la solicitud anterior
        const response = await axios.get<DetailedRevenue[]>(`${backendUrl}/analytics/revenueBySubcourtPayment/${id}`);
        console.log("Recaudo Detallado por Subcancha/Método:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener recaudo detallado:", error);
        throw error;
    }
}