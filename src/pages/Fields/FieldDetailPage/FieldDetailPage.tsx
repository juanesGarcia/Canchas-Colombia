import React from "react";
import { useLocation } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Court } from "../../../types/types"; // Asegúrate de que la ruta sea correcta

export const FieldDetailPage: React.FC = () => {
  const location = useLocation();

  // Lee la información completa del estado de navegación y tipa el objeto
  const court = location.state?.court as Court;

  console.log('aca');
   console.log(court.subcourts);

  if (!court) {
    return <div>Cancha no encontrada.</div>;
  }

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
          key={subcourt.id}
          className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between 
                     border border-gray-200 dark:border-gray-600 shadow-sm"
        >
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              {subcourt.name}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">
              Estado:
            </p>
            {subcourt.state ? (
              <span className="flex items-center text-green-500">
                <CheckCircle className="w-5 h-5 mr-1" /> Disponible
              </span>
            ) : (
              <span className="flex items-center text-red-500">
                <XCircle className="w-5 h-5 mr-1" /> No disponible
              </span>
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