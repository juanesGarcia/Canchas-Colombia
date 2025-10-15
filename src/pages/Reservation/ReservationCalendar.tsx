import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import {
    Clock,
    User,
    KeySquare,
    DollarSign,
    Phone,
    CreditCard,
    Wallet, // Icono para el método de pago
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import Swal from 'sweetalert2';
import { onReservationRegister, getReservationsBySubcourtAndDate } from '../../api/auth';
import { format, addHours, parse } from 'date-fns';
import '../../css/App.css';

// Interfaz para los datos que se envían al backend
interface ReservationData {
    user_id: string;
    user_name: string;
    phone: string;
    subcourt_id: string;
    reservation_date: string;
    reservation_time: string;
    duration: number;
    price_reservation: number;
    transfer: number;
    state: boolean;
    // Campo de método de pago agregado aquí
    payment_method: 'transferencia' | 'tarjeta' | 'efectivo' | 'pending' | string;
}

export const ReservationCalendar: React.FC = () => {
    const { subcourtId } = useParams<{ subcourtId: string }>();
    const navigate = useNavigate();

    // Estados del formulario
    const [cedula, setCedula] = useState('');
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');

    // Estados para el calendario y selector de horas
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [duration, setDuration] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [transferCode, setTransferCode] = useState<number | ''>('');
    
    // Estado para el método de pago (actualizado para incluir 'pending' como default)
    const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'tarjeta' | 'efectivo' | 'pending' | string>('pending');


    const [loading, setLoading] = useState(false);
    const [isFetchingTimes, setIsFetchingTimes] = useState(false);
    const [error, setError] = useState('');

    // Función para generar todas las horas en un rango dado (ej. de 09:00 a 11:00)
    const getHourlyRange = (startTime: string, endTime: string): string[] => {
        const hours: string[] = [];

        // Parsear la hora de inicio y de finalización
        // Se asume que la hora está en formato 'HH:mm:ss' y se usa una fecha de referencia
        const parsedStartTime = parse(startTime, 'HH:mm:ss', new Date());
        const parsedEndTime = parse(endTime, 'HH:mm:ss', new Date());

        let currentTime = parsedStartTime;

        // Iterar cada hora completa hasta que la hora actual sea igual o mayor que la final
        while (currentTime < parsedEndTime) {
            hours.push(format(currentTime, 'HH:mm'));
            currentTime = addHours(currentTime, 1);
        }
        
        return hours;
    };
    
    // Hook para cargar las reservas y generar el rango de horas ocupadas
    useEffect(() => {
        const fetchBookedTimes = async () => {
            if (!subcourtId || !selectedDate) return;
            setIsFetchingTimes(true);
            try {
                const reservations = await getReservationsBySubcourtAndDate(subcourtId, selectedDate);
                console.log("Reservas del backend:", reservations);

                let allBookedTimes: string[] = [];
                reservations.forEach((res: any) => { // 'any' usado aquí para la estructura de respuesta de la API
                    // Validación clave: Verifica que los campos de tiempo no estén vacíos
                    // Se asume que la API devuelve un campo 'end_time' o similar para determinar la duración.
                    // Si 'end_time' no existe en la respuesta de la API, esta lógica puede necesitar un ajuste
                    // para calcular la hora final basada en 'reservation_time' y 'duration'.
                    if (res.reservation_time && res.end_time) {
                        // Intenta generar el rango de horas solo si los datos son válidos
                        try {
                            const occupiedHours = getHourlyRange(res.reservation_time, res.end_time);
                            allBookedTimes = [...allBookedTimes, ...occupiedHours];
                        } catch (error) {
                            console.error(`Error procesando reserva con start_time: ${res.reservation_time}, end_time: ${res.end_time}`, error);
                        }
                    }
                });

                const uniqueBookedTimes = [...new Set(allBookedTimes)];
                setBookedTimes(uniqueBookedTimes);
                console.log("Horas ocupadas:", uniqueBookedTimes);

                if (selectedTime && uniqueBookedTimes.includes(selectedTime)) {
                    setSelectedTime(null);
                }
            } catch (err) {
                console.error("Error al obtener las reservas:", err);
                setBookedTimes([]);
            } finally {
                setIsFetchingTimes(false);
            }
        };

        fetchBookedTimes();
    }, [subcourtId, selectedDate, selectedTime]);

    // Genera las franjas horarias de 7 AM a 11 PM
    const timeSlots = Array.from({ length: 17 }, (_, i) => {
        const hour = i + 7;
        return `${hour < 10 ? '0' : ''}${hour}:00`;
    });

    const handleTimeSelect = (time: string) => {
        if (!bookedTimes.includes(time)) {
            setSelectedTime(time);
        }
    };

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // --- VALIDACIÓN DE DATOS REQUERIDOS ---
        
        let validationError: string | null = null;
        
        // 1. Validar ID de Subcancha
        if (!subcourtId) {
            validationError = "ID de subcancha no encontrado. No se puede registrar la reserva.";
        } 
        // 2. Validar Datos de Contacto
        else if (!cedula.trim()) {
            validationError = "Por favor, ingresa la **Cédula del Cliente**.";
        } else if (!userName.trim()) {
            validationError = "Por favor, ingresa el **Nombre del Cliente**.";
        } else if (!phone.trim()) {
            validationError = "Por favor, ingresa el **Teléfono del Cliente**.";
        } 
        // 3. Validar Fecha y Hora
        else if (!selectedTime) {
            validationError = "Por favor, selecciona una **Hora** para la reserva.";
        } 
        // 4. Validar Duración y Precio (deben ser > 0)
        else if (duration === '' || Number(duration) <= 0) {
            validationError = "Por favor, selecciona una **Duración** válida para la reserva (mayor a 0 minutos).";
        } else if (price === '' || Number(price) <= 0) {
            validationError = "Por favor, ingresa un **Precio Total** válido (mayor a $0).";
        } 
        // 5. Validar Método de Pago
        else if (paymentMethod === 'pending' || paymentMethod === '') {
            validationError = "Debes seleccionar un **Método de Pago** (Efectivo, Tarjeta o Transferencia).";
        } 
        // 6. Validar Código de Transferencia si aplica
        else if (paymentMethod === 'transferencia' && (transferCode === '' || Number(transferCode) <= 0)) {
            validationError = "Si el método de pago es **Transferencia**, debes ingresar un **Código de Transferencia** válido (un valor mayor a $0).";
        }
        
        if (validationError) {
            // Muestra la alerta con el error específico
            setError(validationError.replace(/\*\*/g, ''));
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Datos Incompletos o Inválidos',
                html: validationError, // Uso html para permitir el formato **negrita**
            });
            return;
        }

        // --- PREPARACIÓN Y ENVÍO DE DATOS ---
        const dataToSend: ReservationData = {
            user_id: cedula,
            user_name: userName,
            phone,
            subcourt_id: subcourtId,
            reservation_date: format(selectedDate, 'yyyy-MM-dd'),
            reservation_time: selectedTime,
            duration: Number(duration),
            price_reservation: Number(price),
            // Si el código de transferencia es opcional (no es transferencia), se envía 0 si está vacío.
            transfer: Number(transferCode) || 0, 
            state: true,
            payment_method: paymentMethod, 
        };

        try {
            const success = await onReservationRegister(dataToSend, subcourtId);
            console.log(success)
            if (success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Reserva Exitosa!',
                    text: 'La subcancha ha sido reservada correctamente.',
                    showConfirmButton: false,
                    timer: 2000
                });
                navigate('/Dashboard');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al crear la reserva.';
            setError('Error al crear la reserva. ' + errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error de Reserva',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    // Determina si el campo de código de transferencia debe ser visible y requerido.
    const isTransferCodeRequired = paymentMethod === 'transferencia';

    // Determina si el botón de submit debe estar deshabilitado
    const isSubmitDisabled = !cedula.trim() || 
                           !userName.trim() || 
                           !phone.trim() || 
                           !selectedTime || 
                           duration === '' || Number(duration) <= 0 || 
                           price === '' || Number(price) <= 0 || 
                           paymentMethod === 'pending' || 
                           (isTransferCodeRequired && (transferCode === '' || Number(transferCode) <= 0));
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

                        <div className="py-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                                Selecciona una Hora
                                {isFetchingTimes && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Cargando...</span>}
                            </h3>
                            <div className="time-slots-wrapper p-2 rounded-lg shadow-inner bg-gray-100 dark:bg-gray-900 overflow-y-auto max-h-[250px]">
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {timeSlots.map(time => {
                                        const isBooked = bookedTimes.includes(time);
                                        return (
                                           <div
                                                key={time}
                                                onClick={() => handleTimeSelect(time)}
                                                className={`p-2 rounded-md text-center text-sm font-medium transition-colors duration-200 ease-in-out
                                                    ${isBooked
                                                        ? 'bg-red-600 text-white cursor-not-allowed opacity-50' // Ocupado: Rojo
                                                        : selectedTime === time
                                                            ? 'bg-blue-600 text-white shadow-lg' // Seleccionado: Azul
                                                            : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer' // Disponible: Verde
                                                    }`}
                                            >
                                                {time}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Duración (en minutos)
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                id="duration"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                >
                                <option value="">Selecciona una duración</option>
                                <option value={60}>1 hora (60 min)</option>
                                <option value={120}>2 horas (120 min)</option>
                                <option value={180}>3 horas (180 min)</option>
                                <option value={240}>4 horas (240 min)</option>
                            </select>
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

                        {/* NUEVO CAMPO: MÉTODO DE PAGO */}
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Método de Pago
                            </label>
                            <div className="relative">
                                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    id="paymentMethod"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value as 'transferencia' | 'tarjeta' | 'efectivo' | 'pending' | string)}
                                >
                                    <option value="pending" disabled>Selecciona método de pago</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="tarjeta">Tarjeta (Crédito/Débito)</option>
                                    <option value="transferencia">Transferencia Bancaria/PSE</option>
                                </select>
                            </div>
                        </div>
                        {/* FIN NUEVO CAMPO */}

                        <div>
                            <label htmlFor="transferCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Código de Transferencia (opcional, si aplica)
                            </label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="transferCode"
                                    type="number"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="ej: 10000 (solo si es transferencia)"
                                    value={transferCode}
                                    onChange={(e) => setTransferCode(Number(e.target.value))}
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
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
                            disabled={isSubmitDisabled} // El botón se deshabilita si faltan campos obligatorios
                        >
                            Confirmar Reserva
                        </Button>
                        {isSubmitDisabled && (
                             <p className="text-center text-sm text-red-500 mt-2 font-medium">
                                Por favor, completa todos los campos obligatorios (*) para confirmar la reserva.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
