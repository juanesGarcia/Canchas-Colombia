import React, { useState } from "react";
import { useLocation , useNavigate} from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Plus,
  CalendarCheck, // Importamos el nuevo ícono de reserva
} from "lucide-react";
import { Court } from "../../../types/types";

export const FieldDetailPage: React.FC = () => {
  const location = useLocation();
  const court = location.state?.court as Court;
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  if (!court) {
    return <div>Cancha no encontrada.</div>;
  }

  const handleReserveSubcourt = (subcourtId: string) => {
    // Lógica para redirigir a la página de reserva o abrir un modal
   navigate(`/ReservationCalendar/${subcourtId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        {/* Sección de subcanchas */}
        {court.subcourts && court.subcourts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Subcanchas
            </h3>
            <div className="space-y-4">
              {court.subcourts.map((subcourt) => (
                <div
                  key={subcourt.id?.toString()}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between border border-gray-200 dark:border-gray-600 shadow-sm"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">
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
                        className="px-3 py-1.5 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 mr-2" />
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