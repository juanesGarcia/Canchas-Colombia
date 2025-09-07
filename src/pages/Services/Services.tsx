import React, { useState, useEffect } from "react";
import { ServiceCard } from "../../components/Cards/ServiceCard"; // Importa el nuevo componente
import { getCourts } from "../../api/auth";
import { Court, Service } from "../../types/types";
import { MapPin } from "lucide-react";

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedItems: Court[] = await getCourts();
        const fetchedServices = fetchedItems
          .filter(item => item.is_court === false)
          .map(item => ({
            court_id: item.court_id,
            court_name: item.court_name,
            city: item.city,
            address: item.address, // Asegúrate de incluir todas las propiedades de la interfaz Service
            description: item.description,
            phone: item.phone,
            photos: item.photos,
            court_prices: item.court_prices,
            state: item.state,
            price:item.price
          }));
        setServices(fetchedServices);
      } catch (err) {
        setError("No se pudieron cargar los servicios.");
        console.error("Error fetching services:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleSelectService = (service: Service) => {
    console.log("Contratar servicio:", service);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Servicios Adicionales
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Completa tu experiencia deportiva con nuestros servicios profesionales
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Cargando servicios...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Error: {error}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard // <-- Usa el nuevo componente
                key={service.court_id}
                service={service} // <-- Pasa la prop service
                onSelect={handleSelectService}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron servicios
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Lo sentimos, no hay servicios adicionales disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};