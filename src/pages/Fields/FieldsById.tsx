import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Plus,
  CalendarCheck,
  MapPin,
  Loader,
} from "lucide-react";
// Asegúrate de que estas importaciones son correctas en tu proyecto
import { Subcourt } from "../../types/types";
import { useAuth } from "../../contexts/AuthContext";
import { getSubcourtsByUserId } from "../../api/auth";


/**
 * Componente que muestra la lista de subcanchas de un usuario y un formulario para añadir nuevas.
 */
export const FieldsById: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [subcourts, setSubcourts] = useState<Subcourt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el formulario de agregar subcancha
  const [showForm, setShowForm] = useState(false);
  const [newSubcourtName, setNewSubcourtName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // useEffect para cargar las subcanchas del usuario
  useEffect(() => {
    const fetchSubcourts = async () => {
      if (!user || !user.id) {
        console.log("No user or user ID found. Skipping fetch.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedSubcourts = await getSubcourtsByUserId(user.id);
        setSubcourts(fetchedSubcourts);
        setError(null);
      } catch (err) {
        console.error("Error fetching subcourts:", err);
        setError("No se pudieron cargar las subcanchas. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubcourts();
  }, [user]);

  const handleDeleteSubcourt = (subcourtId: string) => {
    // Lógica para eliminar la subcancha de la API y del estado local
    console.log(`Eliminar subcancha con ID: ${subcourtId}`);
    // Simulación:
    setSubcourts((prevSubcourts) => prevSubcourts.filter((subcourt) => subcourt.id !== subcourtId));
  };

  const handleReserveSubcourt = (subcourtId: string) => {
    navigate(`/ReservationRegister/${subcourtId}`);
  };

  const handleAddSubcourt = () => {
    // Muestra el formulario en lugar de navegar
    setShowForm(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubcourtName.trim() === "") {
      setError("El nombre de la subcancha no puede estar vacío.");
      return;
    }

    setIsSaving(true);
    try {
      // Simulación de guardar en la API. En tu proyecto, llamarías a una función real como 'saveNewSubcourt'
      // const newSubcourt = await saveNewSubcourt(user.id, newSubcourtName);
      const newSubcourt = {
        id: `sub_${Date.now()}`,
        name: newSubcourtName,
        state: true,
      };

      setSubcourts((prevSubcourts) => [...prevSubcourts, newSubcourt]);
      setNewSubcourtName("");
      setShowForm(false);
      setError(null);
      console.log("Nueva subcancha agregada:", newSubcourt);
    } catch (err) {
      console.error("Error saving new subcourt:", err);
      setError("No se pudo guardar la subcancha. Inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 max-w-4xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mis Subcanchas
        </h2>
        <button
          onClick={handleAddSubcourt}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Subcancha
        </button>
      </div>

      {error && (
        <div className="text-center py-4 text-red-500 rounded-lg bg-red-50 mb-4">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500 flex flex-col items-center">
          <Loader className="w-8 h-8 animate-spin mb-4" />
          Cargando subcanchas...
        </div>
      ) : subcourts.length > 0 ? (
        <div className="space-y-4">
          {subcourts.map((subcourt) => (
            <div
              key={subcourt.id}
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
                <button
                  onClick={() => handleDeleteSubcourt(subcourt.id)}
                  className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron subcanchas
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Intenta agregar tu primera subcancha.
          </p>
        </div>
      )}
      
      {/* Formulario de agregar subcancha (condicional) */}
      {showForm && (
        <div className="mt-6 p-6 border rounded-lg shadow-md bg-gray-50 dark:bg-gray-700">
          <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Nueva Subcancha
          </h4>
          <form onSubmit={handleSubmitForm}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre de la Subcancha
              </label>
              <input
                type="text"
                value={newSubcourtName}
                onChange={(e) => setNewSubcourtName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Ej. Cancha Pequeña 3"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNewSubcourtName("");
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  isSaving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isSaving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
