import axios from 'axios';
import {
  User,
  RegistrationData,
  Court,
  Post,
  Photo,
  LoginData 
} from '../types/types.ts';

axios.defaults.withCredentials = true;

const backendUrl = 'http://localhost:3000';

interface GetCourtsResponse {
  success: boolean;
  courts: Court[];
}

interface LoginResponse {
  token: string;
  info: User; 
  success:boolean;

}

export async function onRegister(registrationData: RegistrationData) {
  return await axios.post(`${backendUrl}/register`, registrationData);
}

// Inicio de sesión
export async function onLogin(loginData: LoginData) {
  // Aquí solo especificas el tipo de la respuesta (LoginResponse)
  try {
    const response = await axios.post<LoginResponse>(`${backendUrl}/login`, loginData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Cierre de sesión
export async function onLogout() {
  return await axios.get(`${backendUrl}/logout`);
}

export async function getUsers(): Promise<User[]> {
  const response = await axios.get<User[]>(`${backendUrl}/users`);
  return response.data;
}

// Obtener un usuario por su ID
export async function getUser(id: string): Promise<User> {
  const response = await axios.get(`${backendUrl}/user/${id}`);
  return response.data as User; // Le dices a TypeScript: "confía en mí, esto es un User"
}
// Actualizar un usuario
export async function onUpdateUser(updateData: { id: string; userData: Pick<User, 'name' | 'password'>; token: string }) {
  return await axios.put(`${backendUrl}/user/${updateData.id}`, updateData.userData, {
    headers: {
      'Authorization': `Bearer ${updateData.token}`,
      'Content-Type': 'application/json'
    }
  });
}

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

// Obtener una cancha específica por su ID
export async function getCourtById(id: string): Promise<Court> {
  // Le dices a Axios que la respuesta completa es de tipo GetCourtByIdResponse
  const response = await axios.get<Court>(`${backendUrl}/court/${id}`);
  // Ahora, TypeScript sabe que 'response.data' tiene una propiedad 'court'
  return response.data;
}

// Actualizar una cancha
export async function onUpdateCourt(updateData: { id: string; courtData: Partial<Court>; token: string }) {
  return await axios.put(`${backendUrl}/court/${updateData.id}`, updateData.courtData, {
    headers: {
      'Authorization': `Bearer ${updateData.token}`,
      'Content-Type': 'application/json'
    }
  });
}

// Subir imágenes y actualizar la descripción de una cancha
export async function onUploadImages(uploadData: { id: string; files: File[]; description: string; token: string }) {
  const formData = new FormData();
  uploadData.files.forEach(file => {
    formData.append('images', file);
  });
  formData.append('description', uploadData.description);

  return await axios.post(`${backendUrl}/upload-images/${uploadData.id}`, formData, {
    headers: {
      'Authorization': `Bearer ${uploadData.token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
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
export async function onDeletePost(data: { id: string; token: string }) {
  return await axios.delete(`${backendUrl}/post/${data.id}`, {
    headers: {
      'Authorization': `Bearer ${data.token}`
    }
  });
}

// --- Rutas de Localización ---

// Actualizar la localización del usuario
export async function onUpdateLocation(data: { id: string; latitude: number; longitude: number }) {
  return await axios.post(`${backendUrl}/updatelocation`, data);
}

// --- Rutas de Calificación (Rating) ---

// Calificar a un usuario o cancha
export async function onRating(data: { id: string; rating: number; type: 'user' | 'court' }) {
  return await axios.post(`${backendUrl}/rating`, data);
}

// Obtener la calificación de un usuario
export async function getRating(id: string) {
  return await axios.get(`${backendUrl}/getRating/${id}`);
}

// Verificar si ya se ha calificado a un usuario/cancha
export async function yetRating(data: { userId: string; targetId: string }) {
  return await axios.post(`${backendUrl}/yetrating`, data);
}

// --- Rutas de Seguimiento (Follow) ---

// Seguir a un usuario
export async function onFollow(data: { followerId: string; followedId: string }) {
  return await axios.post(`${backendUrl}/follow`, data);
}

// Dejar de seguir a un usuario
export async function onUnfollow(data: { followerId: string; followedId: string }) {
  return await axios.post(`${backendUrl}/unfollow`, data);
}

// Obtener los seguidores de un usuario
export async function getFollowers(id: string) {
  return await axios.get(`${backendUrl}/followers/${id}`);
}

// Obtener los usuarios seguidos por un usuario
export async function getFollowed(id: string) {
  return await axios.get(`${backendUrl}/followed/${id}`);
}

// Verificar el estado de seguimiento entre dos usuarios
export async function getStatusFollow(data: { followerId: string; followedId: string }) {
  return await axios.post(`${backendUrl}/checkfollowing`, data);
}

// --- Rutas de Reacciones (Reactions) ---

// Reaccionar a un post
export async function onReaction(data: { userId: string; postId: string; reactionType: string }) {
  return await axios.post(`${backendUrl}/reaction`, data);
}

// Deshacer una reacción a un post
export async function unReaction(data: { userId: string; postId: string }) {
  return await axios.post(`${backendUrl}/unreaction`, data);
}

// Obtener las reacciones de un post
export async function getReactions(post_id: string) {
  return await axios.get(`${backendUrl}/getreactions/${post_id}`);
}

// Verificar el estado de las reacciones de un usuario en un post
export async function getStatusReactions(data: { userId: string; postId: string }) {
  return await axios.post(`${backendUrl}/checkreactions`, data);
}

// --- Rutas de Horarios y Disponibilidad ---

// Crear un nuevo horario disponible
export async function onCreateAvailability(data: { courtId: string; day: string; time: string; price: number }) {
  return await axios.post(`${backendUrl}/availability`, data);
}

// Obtener los horarios de disponibilidad de una cancha
export async function getAvailability(courtId: string) {
  return await axios.get(`${backendUrl}/availability/${courtId}`);
}

// Actualizar un horario disponible
export async function onUpdateAvailability(updateData: { id: string; availabilityData: { day?: string; time?: string; price?: number } }) {
  return await axios.put(`${backendUrl}/availability/${updateData.id}`, updateData.availabilityData);
}

// Eliminar un horario disponible
export async function onDeleteAvailability(id: string) {
  return await axios.delete(`${backendUrl}/availability/${id}`);
}