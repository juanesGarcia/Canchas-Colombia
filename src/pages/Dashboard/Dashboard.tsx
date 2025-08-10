import React from "react";
import { Calendar, Clock, MapPin, TrendingUp, Star } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/UI/Button";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Reservas Activas",
      value: "3",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Horas Jugadas",
      value: "24",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Canchas Favoritas",
      value: "2",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Puntos Acumulados",
      value: "1,250",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
  ];

  const recentBookings = [
    {
      id: 1,
      field: "Cancha Principal",
      date: "2024-01-15",
      time: "18:00",
      status: "confirmed",
      price: 50000,
    },
    {
      id: 2,
      field: "Cancha Lateral A",
      date: "2024-01-18",
      time: "20:00",
      status: "pending",
      price: 35000,
    },
    {
      id: 3,
      field: "Cancha Múltiple",
      date: "2024-01-20",
      time: "16:00",
      status: "confirmed",
      price: 25000,
    },
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bienvenido, {user?.name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gestiona tus reservas y actividad deportiva
          </p>
        </div>

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
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Reservas Recientes
                </h2>
                <Button size="sm">Ver Todas</Button>
              </div>

              <div className="space-y-4">
                {recentBookings.map((booking) => (
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
                ))}
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
                <Button variant="primary" size="sm" className="w-full">
                  Nueva Reserva
                </Button>
                <Button size="sm" className="w-full">
                  Mis Reservas
                </Button>
                <Button size="sm" className="w-full">
                  Historial
                </Button>
                <Button size="sm" className="w-full">
                  Configuración
                </Button>
              </div>
            </div>

            <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-2">
                ¡Programa de Fidelidad!
              </h3>
              <p className="text-sm text-green-100 mb-4">
                Acumula puntos con cada reserva y obtén descuentos exclusivos.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">1,250</p>
                  <p className="text-xs text-green-100">Puntos acumulados</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
