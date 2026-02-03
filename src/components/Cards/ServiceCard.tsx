import React, { useCallback } from "react";
import { MapPin, DollarSign, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Service } from "../../types/types";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from 'embla-carousel-react';

// 🎯 Botón de flecha para el carrusel
interface ArrowButtonProps {
  onClick: () => void;
  direction: 'prev' | 'next';
  disabled: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ onClick, direction, disabled }) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  const positionClass = direction === 'prev' ? 'left-2' : 'right-2';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={`
        absolute top-1/2 -translate-y-1/2 p-2 rounded-full 
        bg-white/80 text-gray-800 backdrop-blur-sm shadow-md 
        hover:bg-white transition-opacity duration-300 z-10
        ${positionClass}
        opacity-0 group-hover:opacity-100
        ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
      `}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();
  const hasPhotos = service.photos && service.photos.length > 0;
  const defaultImageUrl = "https://via.placeholder.com/600x400?text=Servicio+No+Disponible";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">

      {/* 📸 Carrusel */}
      <div className="relative h-48" onClick={handleImageClick}>
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {hasPhotos ? (
              service.photos.map((photo, index) => (
                <div key={index} className="flex-shrink-0 flex-grow-0 w-full relative">
                  <img
                    src={photo.url}
                    alt={`${service.court_name} - Imagen ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))
            ) : (
              <div className="flex-shrink-0 flex-grow-0 w-full relative">
                <img
                  src={defaultImageUrl}
                  alt="Servicio por defecto"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* 🔁 Flechas de navegación (solo si hay más de una imagen) */}
        {hasPhotos && service.photos.length > 1 && (
          <>
            <ArrowButton
              direction="prev"
              onClick={scrollPrev}
              disabled={!emblaApi || emblaApi.scrollSnapList().length <= 1}
            />
            <ArrowButton
              direction="next"
              onClick={scrollNext}
              disabled={!emblaApi || emblaApi.scrollSnapList().length <= 1}
            />
          </>
        )}

        {/* Etiqueta */}
        <div className="absolute top-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {service.type}
          </span>
        </div>
      </div>

      {/* 📄 Contenido */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {service.court_name}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2" />
            {service.city}, {service.address}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Phone className="w-4 h-4 mr-2" />
            {service.phone}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <DollarSign className="w-4 h-4 mr-2" />
            Precio: {service.price}
          </div>
          {service.type === 'promotion'  && service.owner_name && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              ⚽ Nombre de la cancha: {service.owner_name}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="primary"
            size="md"
            onClick={() =>
              navigate(`/ServicesDetail/${service.court_id}`, {
                state: { owner_name: service.owner_name }
              })
            }
          >
            {"Detalles"}
          </Button>
        </div>
      </div>
    </div>
  );
};
