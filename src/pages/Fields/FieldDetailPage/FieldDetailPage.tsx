import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    CheckCircle,
    XCircle,
    CalendarCheck,
    ArrowLeft,
} from "lucide-react";
import { Court } from "../../../types/types";

export const FieldDetailPage: React.FC = () => {
    const location = useLocation();
    const court = location.state?.court as Court;
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!court) {
        return <div>Cancha no encontrada.</div>;
    }

    const handleReserveSubcourt = (subcourtId: string) => {
        navigate(`/ReservationCalendar/${subcourtId}`);
    };

    return (
        <div className="relative p-6 sm:p-8 bg-white dark:bg-gray-800 min-h-screen">

            {/* Botón de Volver */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 z-10"
                aria-label="Volver"
            >
                <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            {/* Fin Botón de Volver */}

            <div className="max-w-7xl mx-auto">
                <div className="mb-8 pt-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {court.court_name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Detalles y opciones de reserva para {court.city}
                    </p>
                </div>

                {/* Sección de subcanchas */}
                {court.subcourts && court.subcourts.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                            Subcanchas disponibles
                        </h3>
                        <div className="space-y-4">
                            {court.subcourts.map((subcourt) => (
                                <div
                                    key={subcourt.id?.toString()}
                                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between border border-gray-200 dark:border-gray-600 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                                            {subcourt.name}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">
                                                Estado:
                                            </p>
                                            {subcourt.state ? (
                                                <span className="flex items-center text-green-500">
                                                    <CheckCircle className="w-4 h-4 mr-1" /> Disponible
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-red-500">
                                                    <XCircle className="w-4 h-4 mr-1" /> No disponible
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {subcourt.state && (
                                            <button
                                                onClick={() => handleReserveSubcourt(subcourt.id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 transition-colors shadow-md"
                                            >
                                                <CalendarCheck className="w-5 h-5 mr-2" />
                                                Reservar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};