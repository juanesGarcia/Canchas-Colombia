import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, MapPin} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/UI/Button";
import { useNavigate } from 'react-router-dom';
import { getUserReservation } from '../../api/auth'; // Asegúrate que esta ruta sea correcta
import { Reservation } from "../../types/types";


interface BookingUI {
    id: string;
    field: string;
    date: string;
    time: string;
    status: string;
    price: number;
}

// =======================================================================
// 2. COMPONENTE DASHBOARD
// =======================================================================

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Estados para la data
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Carga de datos al montar el componente
    useEffect(() => {
        const fetchReservations = async () => {
            // Verifica que el usuario y su ID existan
            if (!user || !user.id) {
                setLoading(false);
                return;
            }

            try {
                // Llama a la función de la API con el ID del usuario
                const data = await getUserReservation(user.id);
                
                // 🚀 CORRECCIÓN DEL FILTRO: 
    const activeReservations = data.filter((r: Reservation) => r.state);
                
                setReservations(activeReservations);
                setError(null);
            } catch (err) {
                console.error("Error fetching reservations:", err);
                // 🚀 CORRECCIÓN DE AXIOS: Usamos la type guard importada
          

                setReservations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [user]);

    // Cálculo y transformación de datos (Optimizados con useMemo)
    const processedData = useMemo(() => {
        const sortedBookings: BookingUI[] = reservations
            // Mapeo al formato de la UI
            .map(r => ({
                id: r.reservation_id,
                field: r.subcourt_name,
                date: r.reservation_date,
                time: r.reservation_time,
                status: r.state,
                price: r.price_reservation,
            }))
            // Ordenar por fecha y hora (más reciente primero)
            .sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateB.getTime() - dateA.getTime();
            });
            
        // Últimas 3 reservas para la vista del dashboard
        const recentBookingsUI = sortedBookings.slice(0, 3);
        
        // Calcular estadísticas
        const activeCount = reservations.length;
       const totalDurationMinutes = reservations.reduce((sum, r) => sum + r.duration, 0);
        const totalHours = (totalDurationMinutes / 60).toFixed(1);

        return {
            recentBookingsUI,
            activeCount,
            totalHours
        };
    }, [reservations]);


    // Funciones de utilidad y handlers (mantienen la lógica original)
    const handleNewReservationClick = () => {
        navigate('/bookings');
    };
    
    // Asumiendo que quieres navegar a rutas específicas para cada acción
    const handleMyReservationsClick = () => { navigate(`/ReservationInfo/${reservations[0].subcourt_id}`);};
    const handleHistoryClick = () => { navigate('/history'); };
    const handleSettingsClick = () => { navigate('/settings'); };


    const stats = [
        {
            title: "Reservas Activas",
            value: processedData.activeCount.toString(),
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Horas Reservadas",
            value: processedData.totalHours,
            icon: Clock,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
        },
        {
            title: "Canchas Favoritas",
            value: "2", // Dato estático, actualiza si tienes la lógica real
            icon: MapPin,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
        }
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };
    
    const getStatusLabel = (status: string) => {
        switch (status) {
            case "confirmed":
                return "Confirmada";
            case "pending":
                return "Pendiente";
            case "cancelled":
                return "Cancelada";
            default:
                return status;
        }
    };

    // Manejo de carga
    if (loading) {
        return (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">
                Cargando dashboard... ⏱️
            </div>
        );
    }
    
    // Manejo si el usuario no tiene ID
    if (!user?.id) {
        return (
            <div className="text-center py-10 text-red-600 dark:text-red-400">
                Error: No se pudo identificar al usuario para cargar las reservas.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Bienvenido, {user?.name} 👋
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Gestiona tus reservas y actividad deportiva
                    </p>
                </div>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400 rounded-lg" role="alert">
                        {error}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Reservas Recientes (Data dinámica) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Reservas Recientes
                                </h2>
                                <Button size="sm" onClick={handleMyReservationsClick}>Ver Todas</Button>
                            </div>

                            <div className="space-y-4">
                                {processedData.recentBookingsUI.length > 0 ? (
                                    processedData.recentBookingsUI.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {booking.field}
                                                </h3>
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {booking.date}
                                                    <Clock className="w-4 h-4 ml-3 mr-1" />
                                                    {booking.time}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {formatPrice(booking.price)}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(booking.status)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                        ¡No tienes reservas recientes!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Acciones Rápidas
                            </h2>
                            <div className="space-y-3">
                                <Button variant="primary" size="sm" className="w-full" onClick={handleNewReservationClick}>
                                    Nueva Reserva
                                </Button>
                                <Button size="sm" className="w-full" onClick={handleMyReservationsClick}>
                                    Mis Reservas
                                </Button>
                                <Button size="sm" className="w-full" onClick={handleHistoryClick}>
                                    Historial
                                </Button>
                                <Button size="sm" className="w-full" onClick={handleSettingsClick}>
                                    Configuración
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};