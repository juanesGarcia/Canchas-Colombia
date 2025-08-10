import { MapPin, Users, Calendar, Clock } from "lucide-react";
import { FC } from "react";
import { Field } from "../../types";
import { Button } from "../UI/Button";

interface FieldDetailProps {
  field: Field;
  onBook: (field: Field) => void;
}

export const FieldDetail: FC<FieldDetailProps> = ({ field, onBook }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Imagen principal */}
      <div className="relative h-64 w-full">
        <img
          src={field.image}
          alt={field.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium">
          {field.type === "football" && "Fútbol"}
          {field.type === "basketball" && "Básquet"}
          {field.type === "tennis" && "Tenis"}
          {field.type === "volleyball" && "Voleibol"}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {field.name}
            </h2>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                {field.location.city}, {field.location.address}
              </span>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-md">
            <span className="text-green-600 dark:text-green-400 font-bold">
              ${field.price.toLocaleString()}/hora
            </span>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {field.description}
        </p>

        {/* Características */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Características
          </h3>
          <div className="flex flex-wrap gap-2">
            {field.features.map((feature, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Capacidad
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                Hasta {field.capacity} personas
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 flex items-center justify-center">
              <div
                className={`w-3 h-3 rounded-full ${
                  field.available ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Disponibilidad
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {field.available ? "Disponible" : "No disponible"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tipo de acceso
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {field.isPublic ? "Pública" : "Privada"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Duración
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                Reserva por horas
              </p>
            </div>
          </div>
        </div>

        {/* Botón de reserva */}
        <Button
          variant="primary"
          onClick={() => onBook(field)}
          disabled={!field.available}
          className="w-full"
        >
          {field.available ? "Reservar ahora" : "No disponible"}
        </Button>
      </div>
    </div>
  );
};
