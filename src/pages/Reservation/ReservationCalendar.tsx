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
    Wallet
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import Swal from 'sweetalert2';
import { onReservationRegister, getReservationsBySubcourtAndDate,getSubcourtPriceByDate } from '../../api/auth';
import { format, addHours, parse } from 'date-fns';
import '../../css/App.css';

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
    payment_method: 'transferencia' | 'tarjeta' | 'efectivo' | 'pending' | string;
}

export const ReservationCalendar: React.FC = () => {
    const { subcourtId } = useParams<{ subcourtId: string }>();
    const navigate = useNavigate();

    const [cedula, setCedula] = useState('');
    const [userName, setUserName] = useState('');
    const [day, setDay] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [duration, setDuration] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [transferCode, setTransferCode] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'tarjeta' | 'efectivo' | 'pending' | string>('pending');
    const [loading, setLoading] = useState(false);
    const [isFetchingTimes, setIsFetchingTimes] = useState(false);
    const [error, setError] = useState('');

    // 🔹 Solo permite seleccionar fechas válidas (hoy o futuras)
    const handleDateChange = (date: Date) => {
        const now = new Date();
        const selected = new Date(date);

        // Si la fecha seleccionada es anterior a hoy
        if (selected < new Date(now.setHours(0, 0, 0, 0))) {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha no válida',
                text: `Solo se pueden hacer reservas desde la fecha y hora actual.`,
            });
            return;
        }

        setSelectedDate(selected);
    };

    // 🔹 Generar rango de horas de inicio a fin
    const getHourlyRange = (startTime: string, endTime: string): string[] => {
        const hours: string[] = [];
        const parsedStartTime = parse(startTime, 'HH:mm:ss', new Date());
        const parsedEndTime = parse(endTime, 'HH:mm:ss', new Date());
        let currentTime = parsedStartTime;

        while (currentTime < parsedEndTime) {
            hours.push(format(currentTime, 'HH:mm'));
            currentTime = addHours(currentTime, 1);
        }
        return hours;
    };

    // 🔹 Cargar reservas existentes
    useEffect(() => {
        const fetchBookedTimes = async () => {
            if (!subcourtId || !selectedDate) return;
            setIsFetchingTimes(true);
            try {
                const reservations = await getReservationsBySubcourtAndDate(subcourtId, selectedDate);
                let allBookedTimes: string[] = [];

                reservations.forEach((res: any) => {
                    if (res.reservation_time && res.end_time) {
                        try {
                            const occupiedHours = getHourlyRange(res.reservation_time, res.end_time);
                            allBookedTimes = [...allBookedTimes, ...occupiedHours];
                        } catch (error) {
                            console.error('Error procesando reserva', error);
                        }
                    }
                });

                const uniqueBookedTimes = [...new Set(allBookedTimes)];
                setBookedTimes(uniqueBookedTimes);

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
            const fetchPrice = async () => {
        if (!subcourtId || !selectedDate) return;

        try {
            const fetchedPrice = await getSubcourtPriceByDate(subcourtId, selectedDate);
            setPrice(fetchedPrice.price);
            setDay(fetchedPrice.day_of_week)

        } catch (err) {
            console.error("Error al obtener el precio:", err);
            setPrice('');
        }
    };
        

        fetchBookedTimes();
    fetchPrice();
    }, [subcourtId, selectedDate, selectedTime]);

    // 🔹 Generar horas de 07:00 a 23:00
    const timeSlots = Array.from({ length: 17 }, (_, i) => {
        const hour = i + 7;
        return `${hour < 10 ? '0' : ''}${hour}:00`;
    });

    // 🔹 Filtrar horas pasadas si el día es hoy
    const getAvailableHours = (): string[] => {
        const now = new Date();

        return timeSlots.filter((time) => {
            const [hour, minute] = time.split(':').map(Number);
            const selectedDateIsToday =
                selectedDate.getDate() === now.getDate() &&
                selectedDate.getMonth() === now.getMonth() &&
                selectedDate.getFullYear() === now.getFullYear();

            if (selectedDateIsToday) {
                // Solo permitir horas iguales o posteriores a la hora actual
                return hour >= now.getHours();
            }
            return true;
        });
    };

    const handleTimeSelect = (time: string) => {
        const available = getAvailableHours();
        if (!available.includes(time)) {
            Swal.fire({
                icon: 'warning',
                title: 'Hora no válida',
                text: 'Solo puedes reservar a partir de la hora actual.',
            });
            return;
        }

        if (!bookedTimes.includes(time)) {
            setSelectedTime(time);
        }
    };
    // 🔹 Envío de reserva
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const now = new Date();
        const selectedDateTime = new Date(selectedDate);
        if (selectedTime) {
            const [hour, minute] = selectedTime.split(':').map(Number);
            selectedDateTime.setHours(hour, minute, 0, 0);
        }

        // Bloquear reservas antes de la hora actual
        if (selectedDateTime < now) {
            Swal.fire({
                icon: 'error',
                title: 'Fecha/Hora no válida',
                text: 'Solo puedes hacer reservas desde la fecha y hora actual.',
            });
            setLoading(false);
            return;
        }

        if (!subcourtId || !cedula || !userName || !phone || !selectedTime || !duration || paymentMethod === 'pending') {
            Swal.fire({
                icon: 'error',
                title: 'Datos incompletos',
                text: 'Por favor completa todos los campos obligatorios.',
            });
            setLoading(false);
            return;
        }

        const dataToSend: ReservationData = {
            user_id: cedula,
            user_name: userName,
            phone,
            subcourt_id: subcourtId,
            reservation_date: format(selectedDate, 'yyyy-MM-dd'),
            reservation_time: selectedTime,
            duration: Number(duration),
            price_reservation: Number(price),
            transfer: Number(transferCode) || 0,
            state: true,
            payment_method: paymentMethod,
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
                navigate('/Dashboard');
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Reserva',
                text: err.response?.data?.error || 'Error desconocido al crear la reserva.',
            });
        } finally {
            setLoading(false);
        }
    };

    const availableHours = getAvailableHours();

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
                        {/* Cédula */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cédula del Cliente</label>
                            <div className="relative">
                                <KeySquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                    placeholder="Ej: 1045789123"
                                    value={cedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del Cliente</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                    placeholder="Ej: Juan Pérez"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono del Cliente</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                    placeholder="Ej: 3001234567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Calendario */}
                        <div className="py-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">Selecciona una Fecha</h3>
                            <div className="calendar-wrapper p-2 rounded-lg shadow-inner bg-gray-100 dark:bg-gray-900">
                                <Calendar
                                    onChange={(date: any) => handleDateChange(date)}
                                    value={selectedDate}
                                    minDate={new Date()} // 🔒 evita fechas pasadas
                                />
                            </div>
                        </div>

                        {/* Horas disponibles */}
                        <div className="py-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                                Selecciona una Hora
                                {isFetchingTimes && <span className="ml-2 text-sm text-gray-500">Cargando...</span>}
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {timeSlots.map((time) => {
                                    const isBooked = bookedTimes.includes(time);
                                    const isAvailable = availableHours.includes(time);
                                    return (
                                        <div
                                            key={time}
                                            onClick={() => !isBooked && isAvailable && handleTimeSelect(time)}
                                            className={`p-2 rounded-md text-center text-sm font-medium transition-colors duration-200
                                                ${isBooked
                                                    ? 'bg-red-600 text-white opacity-50 cursor-not-allowed'
                                                    : !isAvailable
                                                        ? 'bg-gray-500 text-white opacity-50 cursor-not-allowed'
                                                        : selectedTime === time
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                                                }`}
                                        >
                                            {time}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Duración */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duración</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                >
                                    <option value="">Selecciona duración</option>
                                    <option value={60}>1 hora</option>
                                    <option value={120}>2 horas</option>
                                    <option value={180}>3 horas</option>
                                    <option value={240}>4 horas</option>
                                </select>
                            </div>
                        </div>

                        {/* Precio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Precio Total {day}</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="number"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                    placeholder="Ej: 50000"
                                    value={price}
                                    readOnly                                />
                            </div>
                        </div>

                        {/* Método de pago */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de Pago</label>
                            <div className="relative">
                                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="pending" disabled>Selecciona método</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="transferencia">Transferencia</option>
                                </select>
                            </div>
                        </div>

                        {/* Código de transferencia */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cantidad a Transfererir</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                    placeholder="Cantidad pagada"
                                      value={transferCode}
                                    onChange={(e) => {
                                        // Solo deja números
                                        const value = e.target.value.replace(/\D/g, "");
                                        setTransferCode(value);
                                    }}
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
                        >
                            Confirmar Reserva
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
