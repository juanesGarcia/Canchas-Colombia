import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import {
    Clock,
    User,
    DollarSign,
    Phone,
    Trash2
} from 'lucide-react';
import { getReservationsBySubcourtAndDate ,onReservationDelete} from '../../api/auth';
import Swal from 'sweetalert2';
import '../../css/App.css';

export interface Reservation {
  reservation_id: string;
  reservation_date: string;
  reservation_time: string;
  duration: number;
  end_time: string;
  state: string;
  price_reservation: number;
  transfer: boolean;
  client_name: string;
  client_phone: string;
  subcourt_id: string;
  subcourt_name: string;
  court_id: string;
  court_name: string;
}

export const ReservationInfo: React.FC = () => {
    const { subcourtId } = useParams<{ subcourtId: string }>();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookedReservations, setBookedReservations] = useState<Reservation[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [isFetchingTimes, setIsFetchingTimes] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            if (!subcourtId || !selectedDate) return;
            setIsFetchingTimes(true);
            try {
                const reservations = await getReservationsBySubcourtAndDate(subcourtId, selectedDate);
                setBookedReservations(reservations);
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

    const handleReservationSelect = (reservation: Reservation) => {
        setSelectedReservation(reservation);
    };

const handleDeleteReservation = async (reservationId: string) => {
  console.log("Eliminar reserva con ID:", reservationId);

  try {
    const response = await onReservationDelete(reservationId);

    if (response) {
      Swal.fire({
        icon: 'success',
        title: 'Reserva eliminada',
        text: 'La reserva se eliminó correctamente.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => Swal.showLoading(),
      });

      // 🔁 Actualizar la lista de reservas
      const updatedReservations = await getReservationsBySubcourtAndDate(subcourtId!, selectedDate);
      setBookedReservations(updatedReservations);

      // 🔙 Volver a la vista de horarios
      setSelectedReservation(null);

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la reserva.',
      });
    }
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un problema al eliminar la reserva.',
    });
  }
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

                    {/* Calendario */}
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

                    {/* Detalle o lista de reservas */}
                    <div className="py-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                            {selectedReservation ? "Detalles de la Reserva" : "Horarios Reservados"}
                            {isFetchingTimes && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Cargando...</span>}
                        </h3>

                        {selectedReservation ? (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <User className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Cliente:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{selectedReservation.client_name}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Phone className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Teléfono:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{selectedReservation.client_phone}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Hora:</span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {selectedReservation.reservation_time} - {selectedReservation.end_time}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <DollarSign className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Precio:</span>
                                    <span className="text-gray-700 dark:text-gray-300">${selectedReservation.price_reservation}</span>
                                </div>

                                {/* Botones */}
                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={() => setSelectedReservation(null)}
                                        className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Ver otros horarios
                                    </button>

                                    <button
                                        onClick={() => handleDeleteReservation(selectedReservation.reservation_id)}
                                        className="flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="time-slots-wrapper p-2 rounded-lg shadow-inner bg-gray-100 dark:bg-gray-900 overflow-y-auto max-h-[250px]">
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {bookedReservations.length > 0 ? (
                                        bookedReservations.map(res => (
                                            <div
                                                key={res.reservation_id}
                                                onClick={() => handleReservationSelect(res)}
                                                className="p-2 rounded-md text-center text-sm font-medium bg-red-600 text-white hover:bg-red-700 cursor-pointer transition"
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
