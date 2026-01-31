import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import {
  Clock,
  User,
  DollarSign,
  Phone,
  Trash2,
  Pencil
} from 'lucide-react';
import {
  getReservationsBySubcourtAndDate,
  onReservationDelete,
  onReservationReminder,
  onReservationUpdate
} from '../../api/auth';
import Swal from 'sweetalert2';
import '../../css/App.css';
import { useAuth } from "../../contexts/AuthContext";

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
  missing_quantity: number;
  phone: string;
}

export const ReservationInfo: React.FC = () => {
  const { subcourtId } = useParams<{ subcourtId: string }>();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookedReservations, setBookedReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isFetchingTimes, setIsFetchingTimes] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      if (!subcourtId) return;
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

  // ✅ RECORDATORIO WHATSAPP
  const ReminderWhassapt = async () => {
    if (!selectedReservation) return;

    if (!user || !user.token) {
      setError('Faltan datos de autenticación. Por favor, vuelve a iniciar sesión.');
      return;
    }

    try {

      const formattedDate = new Date(selectedReservation.reservation_date)
        .toLocaleDateString('es-CO');

      const whatsappMessage = `
      RECORDATORIO DE RESERVA
      Hola ${selectedReservation.client_name}, te recordamos tu reserva:
      Fecha: ${formattedDate}
      Hora: ${selectedReservation.reservation_time}
      Duración: ${selectedReservation.duration} minutos
      Precio: $${selectedReservation.price_reservation}
      Falta de pago : $${selectedReservation.missing_quantity}
      ¡Gracias!
        `;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${selectedReservation.client_phone}?text=${encodedMessage}`;

      // 1. Abre WhatsApp
      window.open(whatsappUrl, '_blank');

      // 2. Alerta visual
      Swal.fire({
        icon: 'success',
        title: '¡Reserva Exitosa!',
        text: 'La reserva fue creada y se enviaron los datos por WhatsApp.',
        confirmButtonText: 'Aceptar'
      });
    }
    catch (error) {
      console.error("Error enviando recordatorio:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el recordatorio"
      });
    }
  };

  const handlePayAll = async () => {
    if (!selectedReservation) return;

    if (!user || !user.token) {
      setError("No estás autenticado");
      return;
    }

    try {
      await onReservationUpdate({
        reservationId: selectedReservation.reservation_id,
        token: user.token
      });

      Swal.fire({
        icon: "success",
        title: "¡Paz y Salvo!",
        text: "La reserva ya quedó totalmente pagada",
        timer: 2000,
        showConfirmButton: false
      });

      // 🔥 recargar desde backend
      const updatedReservations = await getReservationsBySubcourtAndDate(subcourtId!, selectedDate);
      setBookedReservations(updatedReservations);
      setSelectedReservation(null);

    } catch (error) {
      console.error("Error al paz y salvo:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo marcar como pagada.'
      });
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    try {
      await onReservationDelete(reservationId);

      Swal.fire({
        icon: 'success',
        title: 'Reserva eliminada',
        text: 'La reserva se eliminó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });

      const updatedReservations = await getReservationsBySubcourtAndDate(subcourtId!, selectedDate);
      setBookedReservations(updatedReservations);
      setSelectedReservation(null);

    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la reserva.'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8">

        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Reservas de la Subcancha
        </h2>

        <Calendar
          onChange={(date: any) => setSelectedDate(date)}
          value={selectedDate}
          className="w-full"
        />

        <h3 className="text-center text-xl font-bold text-gray-900 dark:text-white mt-4">
          {selectedReservation ? "Detalles de la reserva" : "Horarios reservados"}
        </h3>

        {selectedReservation ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-3">

            <div className="flex items-center gap-2">
              <User /> {selectedReservation.client_name}
            </div>

            <div className="flex items-center gap-2">
              <Phone /> {selectedReservation.client_phone}
            </div>

            <div className="flex items-center gap-2">
              <Clock />
              {selectedReservation.reservation_time} - {selectedReservation.end_time}
            </div>

            <div className="flex items-center gap-2">
              <DollarSign />
              Faltante: ${Number(selectedReservation.missing_quantity).toFixed(0)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              <button
                onClick={() => setSelectedReservation(null)}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Volver
              </button>

              <button
                onClick={ReminderWhassapt}
                className="flex-1 bg-yellow-500 text-white py-2 rounded"
              >
                Recordatorio
              </button>
              <button
                onClick={handlePayAll}
                disabled={Number(selectedReservation.missing_quantity) === 0}
                className={`flex-1 py-2 rounded ${Number(selectedReservation.missing_quantity) === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white"
                  }`}
              >
                Paz y Salvo
              </button>
              <button
                onClick={() => handleDeleteReservation(selectedReservation.reservation_id)}
                className="flex-1 bg-red-600 text-white py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {bookedReservations.map(res => (
              <div
                key={res.reservation_id}
                onClick={() => handleReservationSelect(res)}
                className="bg-red-600 text-white p-2 rounded text-center cursor-pointer"
              >
                {res.reservation_time}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
