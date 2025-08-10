import React from "react";
import { MapPin, Users, Star, Clock } from "lucide-react";
import { Field } from "../../types";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";

interface FieldCardProps {
  field: Field;
  onBook?: (field: Field) => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({ field, onBook }) => {
  const navigate = useNavigate();

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat("es-CO", {
  //     style: "currency",
  //     currency: "COP",
  //     minimumFractionDigits: 0,
  //   }).format(price);
  // };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img
          src={field.image}
          alt={field.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {field.type}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          {/* <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              field.available
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {field.available ? "Disponible" : "Ocupada"}
          </div> */}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {field.name}
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
            {field.location.city}, {field.location.address}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            Hasta {field.capacity} personas
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            Por hora
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {field.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
            >
              {feature}
            </span>
          ))}
          {field.features.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs">
              +{field.features.length - 3} más
            </span>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2">
          {/* <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatPrice(field.price)}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              /hora
            </span>
          </div> */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/fields/${field.id}`)}
          >
            {"Detalles"}
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!field.available}
            onClick={() => onBook?.(field)}
          >
            {field.available ? "Reservar" : "disponible"}
          </Button>
        </div>
      </div>
    </div>
  );
};
