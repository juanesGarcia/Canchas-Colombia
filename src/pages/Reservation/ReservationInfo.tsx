import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import {
    Clock,
    User,
    KeySquare,
    DollarSign,
    Phone,
} from 'lucide-react';
import { getReservationsBySubcourtAndDate } from '../../api/auth';
import { format } from 'date-fns';
import '../../css/App.css';

// Interfaz para las reservas obtenidas del backend
interface Reservation {
    _id: string; 
    user_id: string;
    client_name: string;
    phone: string;
    subcourt_id: string;
    reservation_date: string;
    reservation_time: string;
    end_time: string;
    duration: number;
    price_reservation: number;
    transfer: number;
    state: boolean;

}

export const ReservationInfo: React.FC = () => {
    const { subcourtId } = useParams<{ subcourtId: string }>();
    const navigate = useNavigate();

    // Estados para el calendario y la lista de reservas
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookedReservations, setBookedReservations] = useState<Reservation[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [isFetchingTimes, setIsFetchingTimes] = useState(false);
    const [error, setError] = useState('');

    // Hook para cargar las reservas al cambiar de fecha
    useEffect(() => {
        const fetchReservations = async () => {
            if (!subcourtId || !selectedDate) return;
            setIsFetchingTimes(true);
            try {
                const reservations = await getReservationsBySubcourtAndDate(subcourtId, selectedDate);
                console.log(reservations)
                setBookedReservations(reservations);
                // Resetea la reserva seleccionada si se cambia la fecha
                setSelectedReservation(null);
            } catch (err) {
                console.error("Error al obtener las reservas:", err);
                setBookedReservations([]);
            } finally {
                setIsFetchingTimes(false);
            }
        };

        fetchReservations();
    }, [subcourtId, selectedDate]);

    // Función para manejar la selección de una reserva específica
    const handleReservationSelect = (reservation: Reservation) => {
        setSelectedReservation(reservation);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">R</span>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                        Reservas de la Subcancha
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Selecciona una fecha para ver las reservas existentes.
                    </p>
                </div>

                <div className="space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}
                    
                    {/* Sección del Calendario */}
                    <div className="py-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">Selecciona una Fecha</h3>
                        <div className="calendar-wrapper p-2 rounded-lg shadow-inner bg-gray-100 dark:bg-gray-900">
                            <Calendar
                                onChange={(date: any) => setSelectedDate(date)}
                                value={selectedDate}
                                className="w-full border-none"
                            />
                        </div>
                    </div>

                    {/* Sección de Horarios y Tarjeta de Reserva */}
                    <div className="py-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                            {selectedReservation ? "Detalles de la Reserva" : "Horarios Reservados"}
                            {isFetchingTimes && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Cargando...</span>}
                        </h3>
                        
                        {selectedReservation ? (
                            // Tarjeta de la Reserva Seleccionada
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <User className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Cliente:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{selectedReservation?.client_name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <KeySquare className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Cédula:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{selectedReservation?.user_id}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Teléfono:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{selectedReservation?.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Hora:</span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {selectedReservation?.reservation_time} - {selectedReservation?.end_time}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Precio:</span>
                                    <span className="text-gray-700 dark:text-gray-300">${selectedReservation?.price_reservation}</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedReservation(null)}
                                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Ver otros horarios
                                </button>
                                            <button 
                                    onClick={() => setSelectedReservation(null)}
                                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Modificar Reserva
                                </button>
                            </div>
                        ) : (
                            // Cuadrícula de Horarios Reservados
                            <div className="time-slots-wrapper p-2 rounded-lg shadow-inner bg-gray-100 dark:bg-gray-900 overflow-y-auto max-h-[250px]">
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {bookedReservations.length > 0 ? (
                                        bookedReservations.map(res => (
                                            <div
                                                key={res._id}
                                                onClick={() => handleReservationSelect(res)}
                                                className="p-2 rounded-md text-center text-sm font-medium transition-colors duration-200 ease-in-out
                                                           bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                                            >
                                                {res.reservation_time}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                                            No hay reservas para esta fecha.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
