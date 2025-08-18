import React from "react";
import { MapPin, Star, Clock } from "lucide-react";
import { Service } from "../../types/types"; // Importa la interfaz Service
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  service: Service; // <-- Cambiado a Service
  onSelect?: (service: Service) => void; // <-- Cambiado a Service
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const navigate = useNavigate();

  const imageUrl = service.photos && service.photos.length > 0 ? service.photos[0].url : "ruta-a-imagen-por-defecto.jpg";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img
          src={imageUrl}
          alt={service.court_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Servicio
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {service.court_name}
          </h3>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">5.0</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2" />
            {service.city}, {service.address}
          </div>
          {/* Removido el icono de Usuarios porque los servicios no tienen "capacidad" */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            {service.phone}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            Precio: {service.court_prices[0]?.price} {/* Adaptado para mostrar el precio del servicio */}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {/* Se remueve el bloque de features si no aplica a servicios */}
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/services/${service.court_id}`)}
          >
            {"Detalles"}
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!service.state}
            onClick={() => onSelect?.(service)}
          >
            {"Contratar"}
          </Button>
        </div>
      </div>
    </div>
  );
};