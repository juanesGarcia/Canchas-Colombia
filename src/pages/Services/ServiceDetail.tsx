import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Star, Clock, ArrowLeft, Loader, XCircle } from "lucide-react";
// Importa la función de tu API para obtener un servicio por su ID.
import { getCourtById } from "../../api/auth";
import { Service } from "../../types/types";

export const ServiceDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [service, setService] = useState<Service>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si no se proporciona un ID, no intentes buscar nada.
    if (!id) {
      setIsLoading(false);
      setError("No se proporcionó un ID de servicio.");
      return;
    }

    const fetchServiceDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedService = await getCourtById(id);
        setService(fetchedService);
      } catch (err) {
        console.error("Error al obtener los detalles del servicio:", err);
        setError("No se pudo cargar la información del servicio.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  // Función para manejar el clic del botón de WhatsApp
  const handleWhatsAppClick = () => {
    if (!service || !service.phone) {
      console.error("Número de teléfono no disponible.");
      return;
    }

    const whatsappMessage = `
    ¡Hola! 👋
    
    Estoy interesado/a en el servicio "${service.court_name}".
    
    Descripción:
    ${service.description}
    
    Ubicación:
    ${service.city}, ${service.address}
    
    ¿Podrías darme más información sobre cómo puedo obtener este servicio?
    `;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${service.phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const imageUrl = service?.photos?.[0]?.url || "https://placehold.co/800x600/cccccc/333333?text=Sin+Imagen";

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

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No se encontró el servicio.
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
            alt={service.court_name}
            className="w-full h-80 object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Servicio
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
              {service.court_name}
            </h1>
            <div className="flex items-center text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-1 text-base font-semibold">5.0</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            {service.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-base font-medium">
                {service.city}, {service.address}
              </span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-base font-medium">
                Precio: {service.price}
              </span>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleWhatsAppClick}
              className="px-8 py-3 rounded-full text-white font-bold bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-lg"
            >
              Reservar Ahora por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
