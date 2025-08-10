import React from 'react';
import { ServiceCard } from '../../components/Cards/ServiceCard';
import { SERVICES } from '../../constants';
import { Service } from '../../types';

export const Services: React.FC = () => {
  const handleSelectService = (service: Service) => {
    // Aquí implementarías la lógica de contratación
    console.log('Contratar servicio:', service);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onSelect={handleSelectService}
            />
          ))}
        </div>
      </div>
    </div>
  );
};