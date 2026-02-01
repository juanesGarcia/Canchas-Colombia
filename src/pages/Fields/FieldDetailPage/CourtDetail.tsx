import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Star, ArrowLeft, Loader, XCircle, ChevronLeft, ChevronRight , Phone} from "lucide-react";
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';

import { getCourtById } from "../../../api/auth";
import { Service as Court} from "../../../types/types"; 
import {Map} from "../../Map/Map";

// -----------------------------------------------------------
// 1. COMPONENTE AUXILIAR: Botón de flecha para el carrusel
// -----------------------------------------------------------
interface ArrowButtonProps {
    onClick: () => void;
    direction: 'prev' | 'next';
    disabled: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ onClick, direction, disabled }) => {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
    const positionClass = direction === 'prev' ? 'left-4' : 'right-4';

    return (
        <button
            onClick={(e) => {
                e.stopPropagation(); // Evita que el clic propague eventos indeseados
                onClick();
            }}
            disabled={disabled}
            className={`
                absolute top-1/2 -translate-y-1/2 p-3 rounded-full 
                bg-white/70 text-gray-800 backdrop-blur-sm shadow-xl 
                hover:bg-white transition-all duration-300 z-20
                ${positionClass}
                // Las flechas son visibles en la vista de detalle
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'}
            `}
        >
            <Icon className="w-6 h-6" />
        </button>
    );
};
// -----------------------------------------------------------


// -----------------------------------------------------------
// 2. COMPONENTE PRINCIPAL: CourtDetail
// -----------------------------------------------------------

export const CourtDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [court, setCourt] = useState<Court>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🚀 INICIALIZACIÓN DE EMBLA CAROUSEL
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 30,
    });

    // 🚀 Funciones de control del carrusel (usando useCallback para evitar re-renders innecesarios)
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    // Lógica de carga de datos
   useEffect(() => {
  if (!id) {
    setIsLoading(false);
            setError("No se proporcionó un ID de cancha."); 
    return;
  }

        const fetchCourtDetails = async () => { 
  setIsLoading(true);
  setError(null);
            try {
                const fetchedCourt = await getCourtById(id);
                setCourt(fetchedCourt); 
            } catch (err) {
                console.error("Error al obtener los detalles de la cancha:", err); 
      setError("No se pudo cargar la información de la cancha.");
            } finally {
      setIsLoading(false);
            }
        };

        fetchCourtDetails();
}, [id]);
    const hasPhotos = court?.photos && court.photos.length > 0;
    const defaultImageUrl = "https://placehold.co/800x600/cccccc/333333?text=Sin+Imagen";

    // --- Renderizado de estados ---

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

    if (!court) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No se encontró la cancha.
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

                {/* 🚀 INICIO DEL CARRUSEL (Área de la imagen) */}
                <div className="relative h-96">
                    <div className="overflow-hidden h-full" ref={emblaRef}>
                        <div className="flex h-full">
                            {hasPhotos ? (
                                court.photos.map((photo, index) => (
                                    <div key={index} className="flex-shrink-0 flex-grow-0 w-full relative">
                                        <img
                                            src={photo.url}
                                            alt={`${court.court_name} - Imagen ${index + 1}`}
                                            className="w-full h-full object-cover"
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

                    {/* Flechas de Navegación (solo si hay más de una foto) */}
                    {hasPhotos && court.photos.length > 1 && (
                        <>
                            <ArrowButton
                                direction="prev"
                                onClick={scrollPrev}
                                // La lógica de `disabled` se puede refinar con Embla, pero para loop=true, rara vez se usa
                                disabled={false}
                            />
                            <ArrowButton
                                direction="next"
                                onClick={scrollNext}
                                disabled={false}
                            />
                        </>
                    )}

                    {/* Botón de Volver */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 right-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 z-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Volver"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                    </button>

                    {/* Etiqueta de tipo de cancha */}
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {court.court_type || "Cancha"}
                        </span>
                    </div>
                </div>
                {/* 🚀 FIN DEL CARRUSEL */}

                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {court.court_name}
                        </h1>
                        <div className="flex items-center text-yellow-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="ml-1 text-base font-semibold">5.0</span>
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                        {court.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-6">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                            <span className="text-base font-medium">
                                {court.city}, {court.address}
                            </span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <span className="text-base font-medium">
                               $ Precio: {court.price}
                            </span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                            <span className="text-base font-medium">
                                Telefono: {court.phone}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
            <div className="mt-8 max-w-4xl mx-auto">
                <div className="w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden shadow-lg">
                    <Map address={court?.address} />
                </div>
            </div>
        </div>
    );
};

export default CourtDetail;