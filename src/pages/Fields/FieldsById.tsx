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
import Swal from "sweetalert2";
import { Subcourt, RegistrationSubCourt } from "../../types/types";
import { useAuth } from "../../contexts/AuthContext";
import { getSubcourtsByUserId, onSubCourt, deleteSubcourt } from "../../api/auth";

/**
 * Componente que muestra la lista de subcanchas de un usuario y un formulario para añadir nuevas.
 */
export const FieldsById: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [subcourts, setSubcourts] = useState<Subcourt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [newSubcourtName, setNewSubcourtName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // useEffect para cargar las subcanchas del usuario al montar el componente
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
        setError(
          "No se pudieron cargar las subcanchas. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubcourts();
  }, [user]);

  const handleDeleteSubcourt = async (subcourt: Subcourt) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar la subcancha "${subcourt.subcourt_name}"? ¡No podrás revertir esto!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡borrarla!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        if (!user || !user.token) {
          console.error("Authentication error: No user or token available.");
          Swal.fire(
            "Error de autenticación",
            "No se pudo completar la acción. Por favor, inicia sesión de nuevo.",
            "error"
          );
          return;
        }

        const isDeleted = await deleteSubcourt(subcourt.subcourt_id, user.token);
        if (isDeleted) {
          setSubcourts((prevSubcourts) =>
            prevSubcourts.filter((s) => s.subcourt_id !== subcourt.subcourt_id)
          );
          Swal.fire(
            "¡Borrado!",
            `La subcancha "${subcourt.subcourt_name}" ha sido eliminada correctamente.`,
            "success"
          );
        } else {
          Swal.fire(
            "Error",
            "No se pudo eliminar la subcancha. Inténtalo de nuevo.",
            "error"
          );
        }
      } catch (err) {
        console.error("Error al eliminar la subcancha:", err);
        Swal.fire(
          "Error",
          "Hubo un problema al intentar eliminar la subcancha.",
          "error"
        );
      }
    }
  };

  const handleReserveSubcourt = (subcourtId: string) => {
    navigate(`/ReservationRegisterDashboard/${subcourtId}`);
  };

  const handleAddSubcourt = () => {
    setShowForm(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubcourtName.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El nombre de la subcancha no puede estar vacío.",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (!user || !user.id || !user.token) {
        throw new Error("User ID or token is not available.");
      }

      const newSubcourtData: RegistrationSubCourt = {
        name: newSubcourtName,
        state: true,
      };

      // Se llama a la API para crear la cancha.
      // ⚠️ ¡IMPORTANTE! Tu API debe retornar el objeto completo de la cancha creada.
      const newSubcourt = await onSubCourt(user.id, newSubcourtData, user.token);

      // Si la API devuelve el objeto, se actualiza el estado localmente.
      setSubcourts((prevSubcourts) => [...prevSubcourts, newSubcourt]);

      setNewSubcourtName("");
      setShowForm(false);
      setError(null);
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: `La subcancha "${newSubcourt.subcourt_name}" ha sido agregada correctamente.`,
      });
    } catch (err) {
      console.error("Error saving new subcourt:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la subcancha. Inténtalo de nuevo.",
      });
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
              key={subcourt.subcourt_id}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between border border-gray-200 dark:border-gray-600 shadow-sm"
            >
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white">
                  {subcourt.subcourt_name}
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
                    onClick={() => handleReserveSubcourt(subcourt.subcourt_id)}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors"
                  >
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    Reservar
                  </button>
                )}
                <button
                  onClick={() => handleDeleteSubcourt(subcourt)}
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
                  isSaving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
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