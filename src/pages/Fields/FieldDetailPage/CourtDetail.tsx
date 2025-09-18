import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Star, Clock, ArrowLeft, Loader, XCircle } from "lucide-react";
// Importa la función de tu API para obtener una cancha por su ID.
import { getCourtById } from "../../../api/auth"; // El nombre de la función es correcto

// Define el tipo `Court` con las propiedades que esperas de la API.
// Si ya tienes un tipo `Service` que contiene estas propiedades, puedes renombrarlo o crear uno nuevo.
// Asumo que `Service` y `Court` son lo mismo en este contexto.
import { Service as Court} from "../../../types/types"; 

export const CourtDetail: React.FC = () => { // Renombra el componente
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [court, setCourt] = useState<Court>(); // Renombra la variable de estado
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si no se proporciona un ID, no intentes buscar nada.
    if (!id) {
      setIsLoading(false);
      setError("No se proporcionó un ID de cancha."); // Cambia el texto del error
      return;
    }

    const fetchCourtDetails = async () => { // Renombra la función
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCourt = await getCourtById(id);
        setCourt(fetchedCourt); // Usa la nueva variable de estado
      } catch (err) {
        console.error("Error al obtener los detalles de la cancha:", err); // Cambia el texto del error
        setError("No se pudo cargar la información de la cancha."); // Cambia el texto del error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourtDetails();
  }, [id]);

  // Función para manejar el clic del botón de WhatsApp
  const handleWhatsAppClick = () => {
    if (!court || !court.phone) {
      console.error("Número de teléfono no disponible.");
      return;
    }

    const whatsappMessage = `
    ¡Hola! 👋
    
    Estoy interesado/a en la cancha "${court.court_name}". // Renombra la variable
    
    Descripción:
    ${court.description} // Usa la nueva variable
    
    Ubicación:
    ${court.city}, ${court.address} // Usa la nueva variable
    
    ¿Podrías darme más información sobre cómo puedo reservar?
    `;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${court.phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Usa la variable `court` en lugar de `service`
  const imageUrl = court?.photos?.[0]?.url || "https://placehold.co/800x600/cccccc/333333?text=Sin+Imagen";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader className="animate-spin text-green-500 w-12 h-12" />
        <span className="ml-3 text-lg font-medium text-gray-700 dark:text-gray-300">Cargando detalles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Volver
        </button>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No se encontró la cancha. // Cambia el texto
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
          <img
            src={imageUrl}
            alt={court.court_name} // Usa la nueva variable
            className="w-full h-80 object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Cancha // Cambia la etiqueta
            </span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Volver"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {court.court_name} 
            </h1>
            <div className="flex items-center text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-1 text-base font-semibold">5.0</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            {court.description} 
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-base font-medium">
                {court.city}, {court.address} 
              </span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-base font-medium">
                Precio: {court.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDetail;