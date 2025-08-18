import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { Court } from "../../../types/types";

export const FieldDetailPage: React.FC = () => {
  const location = useLocation();
  const court = location.state?.court as Court;

  const [showForm, setShowForm] = useState(false);

  if (!court) {
    return <div>Cancha no encontrada.</div>;
  }

  const handleAddSubcourt = () => {
    setShowForm(true);
  };

  const handleDeleteSubcourt = (subcourtId: string) => {
    // Lógica para eliminar la subcancha
    console.log(`Eliminar subcancha con ID: ${subcourtId}`);
  };

  const handleSubmitForm = (newSubcourtData: any) => {
    // Lógica para enviar la nueva subcancha a la API
    console.log("Nueva subcancha a agregar:", newSubcourtData);
    setShowForm(false);
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
                  <button
                    onClick={() => handleDeleteSubcourt(subcourt.id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón para agregar subcancha */}
        <div className="mt-8 text-center">
          <button
            onClick={handleAddSubcourt}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Subcancha
          </button>
        </div>

        {/* Formulario de agregar subcancha (condicional) */}
        {showForm && (
          <div className="mt-6 p-6 border rounded-lg shadow-md bg-gray-50 dark:bg-gray-700">
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Nueva Subcancha
            </h4>
            {/* Aquí iría tu formulario real */}
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitForm({}); }}>
              {/* Ejemplo de campos del formulario */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre de la Subcancha
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ej. Cancha Pequeña 3"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};