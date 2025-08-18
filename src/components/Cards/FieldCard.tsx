import React from "react";
import { MapPin, Users, Star, Clock } from "lucide-react";
import { Court } from "../../types/types"; // Importa la interfaz Court
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";

interface FieldCardProps {
  field: Court; // <-- Cambiado a Court
  onBook?: (field: Court) => void; // <-- Cambiado a Court
}

export const FieldCard: React.FC<FieldCardProps> = ({ field, onBook }) => {
  const navigate = useNavigate();

  // Asume que la primera foto es la principal
  const imageUrl = field.photos && field.photos.length > 0 ? field.photos[0].url : "ruta-a-imagen-por-defecto.jpg";

  // Aquí necesitas adaptar las propiedades según tu interfaz Court
  // Por ejemplo, `field.name` no existe en `Court`, pero sí `field.court_name`.
  // La ubicación (`field.location`) también debe ser adaptada si Court no la tiene
  // de la misma manera que Field. En tu interfaz Court tienes `address` y `city`.

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img
          src={imageUrl} // <-- Adaptado para usar las fotos de Court
          alt={field.court_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {field.court_type} {/* <-- Cambiado a court_type */}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {field.court_name} {/* <-- Cambiado a court_name */}
          </h3>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">4.8</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {field.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2" />
            {field.city}, {field.address} {/* <-- Adaptado a las propiedades de Court */}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            {/* Si no tienes una propiedad `capacity` en Court, esto podría dar error */}
            Hasta X personas
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            {field.phone}
          </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            {field.price}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {/* Si Court tiene una propiedad `features`, úsala aquí */}
          {/* De lo contrario, este bloque podría necesitar ser eliminado o adaptado */}
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/fields/${field.court_id}`, { state: { court: field } })}
          >
            {"Detalles"}
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!field.state}
            onClick={() => onBook?.(field)}
          >
            {"Reservar"}
          </Button>
        </div>
      </div>
    </div>
  );
};