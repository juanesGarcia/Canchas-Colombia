import React, { useCallback } from "react"; // Importar useCallback
import { MapPin, Users, Star, DollarSign, Phone, ChevronLeft, ChevronRight } from "lucide-react"; // Nuevos iconos
import { Court } from "../../types/types";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react'; // Importar EmblaCarouselType si Court no lo tiene

// -----------------------------------------------------------
// 🚀 NUEVO COMPONENTE: Botón de flecha para el carrusel
// (Mantenido arriba en la explicación para claridad, pero debe ir aquí o en un archivo separado)
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
                e.stopPropagation(); // Previene que el clic active eventos de la tarjeta
                onClick();
            }}
            disabled={disabled}
            className={`
                absolute top-1/2 -translate-y-1/2 p-2 rounded-full 
                bg-white/80 text-gray-800 backdrop-blur-sm shadow-md 
                hover:bg-white transition-opacity duration-300 z-10
                ${positionClass}
                // Ocultar por defecto y mostrar solo en hover del grupo principal
                opacity-0 group-hover:opacity-100 
                ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
            `}
        >
            <Icon className="w-5 h-5" />
        </button>
    );
};
// -----------------------------------------------------------

interface FieldCardProps {
    field: Court;
    onBook?: (field: Court) => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({ field, onBook }) => {
    const navigate = useNavigate();
    const hasPhotos = field.photos && field.photos.length > 0;
    const defaultImageUrl = "https://via.placeholder.com/600x400?text=Cancha+No+Disponible";

    // 🚀 INICIALIZACIÓN DE EMBLA CAROUSEL CON LÓGICA DE CONTROL
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 30,
        dragFree: true, // Permite arrastrar libremente para una mejor UX móvil
    });

    // Controlar la navegación y el estado de los botones
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
        // El contenedor principal lleva la clase 'group' para el hover de las flechas
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">

            {/* 🚀 CARRUSEL DE IMÁGENES (relative para posicionar flechas) */}
            <div className="relative h-48" onClick={handleImageClick}>
                <div className="overflow-hidden h-full" ref={emblaRef}>
                    <div className="flex h-full">
                        {hasPhotos ? (
                            field.photos.map((photo, index) => (
                                <div key={index} className="flex-shrink-0 flex-grow-0 w-full relative">
                                    <img
                                        src={photo.url}
                                        alt={`${field.court_name} - Imagen ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="flex-shrink-0 flex-grow-0 w-full relative">
                                <img
                                    src={defaultImageUrl}
                                    alt="Cancha por defecto"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Flechas de Navegación (solo si hay fotos) */}
                {hasPhotos && field.photos.length > 1 && (
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

                {/* Etiqueta de tipo de cancha */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {/* Tipo de cancha */}
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {field.court_type}
                    </span>

                    {/* Estado */}
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${field.state
                                ? 'bg-blue-600 text-white'
                                : 'bg-red-600 text-white'
                            }`}
                    >
                        {field.state ? 'Activo' : 'Inactivo'}
                    </span>
                </div>  
            </div>
            {/* ----------------- */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {field.court_name}
                    </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {field.description}
                </p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {field.city}, {field.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-2" />
                        {field.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {field.price}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center justify-end space-x-2">
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate(`/fields/${field.court_id}`, { state: { court: field } })}
                    >
                        {"Reserva"}
                    </Button>
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => navigate(`/CourtDetail/${field.court_id}`)}
                    >
                        {"Detalles"}
                    </Button>
                </div>
            </div>
        </div>
    );
};