import React from 'react';
import { Clock, Star } from 'lucide-react';
import { Service } from '../../types';
import { Button } from '../UI/Button';

interface ServiceCardProps {
  service: Service;
  onSelect?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img 
          src={service.image} 
          alt={service.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-3 py-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">4.9</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.name}</h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Clock className="w-4 h-4 mr-2" />
          Duración: {service.duration} minutos
        </div>
        
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Incluye:</h4>
          <ul className="space-y-1">
            {service.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                {feature}
              </li>
            ))}
          </ul>
          {service.features.length > 3 && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              +{service.features.length - 3} beneficios más
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatPrice(service.price)}
          </div>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => onSelect?.(service)}
          >
            Contratar
          </Button>
        </div>
      </div>
    </div>
  );
};