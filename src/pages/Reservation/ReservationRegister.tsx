import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    User,
    KeySquare,
    DollarSign,
    Phone,
    CreditCard,
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import Swal from 'sweetalert2';
import { onReservationRegister } from '../../api/auth';

export const ReservationRegister: React.FC = () => {
    const { subcourtId } = useParams<{ subcourtId: string }>();
    const navigate = useNavigate();

    // Estados del formulario
    const [cedula, setCedula] = useState('');
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const [duration, setDuration] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [transferCode, setTransferCode] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (subcourtId) {
            console.log(`Registrando reserva para la subcancha con ID: ${subcourtId}`);
        }
    }, [subcourtId]);
    // En ReservationRegister.tsx, dentro de handleSubmit

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!subcourtId) {
        setError("ID de subcancha no encontrado. No se puede registrar la reserva.");
        setLoading(false);
        Swal.fire({
            icon: 'error',
            title: 'Error de URL',
            text: 'ID de subcancha no encontrado en la URL.',
        });
        return; // Detiene la ejecución si subcourtId no existe
    }

    const dataToSend = {
        user_id: cedula,
        user_name: userName,
        phone,
        subcourt_id: subcourtId, // TypeScript ahora sabe que es un string porque salimos del if si no lo es
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        duration: Number(duration),
        price_reservation: Number(price),
        transfer: transferCode,
        state:true
    };

   try {
        const success = await onReservationRegister(dataToSend, subcourtId);

        if (success) {
            Swal.fire({
                icon: 'success',
                title: '¡Reserva Exitosa!',
                text: 'La subcancha ha sido reservada correctamente.',
                showConfirmButton: false,
                timer: 2000
            });
            navigate('/');
        } 
    } catch (err:any) {
        // Esta es la parte modificada.
        const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al crear la reserva.';
        setError('Error al crear la reserva. ' + errorMessage);
        Swal.fire({
            icon: 'error',
            title: 'Error de Reserva',
            text: errorMessage, // Aquí se muestra el mensaje de error del backend.
        });
    } finally {
        setLoading(false);
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
                        Registrar Nueva Reserva
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Completa la información para reservar tu subcancha.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cédula del Cliente
                            </label>
                            <div className="relative">
                                <KeySquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="cedula"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: 1045789123"
                                    value={cedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre del Cliente
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="userName"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: Juan Pérez"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Teléfono del Cliente
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: 3001234567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Fecha de la Reserva
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="reservationDate"
                                    type="date"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={reservationDate}
                                    onChange={(e) => setReservationDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reservationTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Hora de Inicio
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="reservationTime"
                                    type="time"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={reservationTime}
                                    onChange={(e) => setReservationTime(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Duración (en minutos)
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="duration"
                                    type="number"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: 60"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Precio Total
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="price"
                                    type="number"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: 50000"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="transferCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Código de Transferencia (opcional)
                            </label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="transferCode"
                                    type="number"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Código de confirmación de pago"
                                    value={transferCode}
                                    onChange={(e) => setTransferCode(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="w-full"
                        >
                            Confirmar Reserva
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};