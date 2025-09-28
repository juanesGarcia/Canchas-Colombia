import React, { useState, useEffect } from "react";
import { Loader, Trash2 } from "lucide-react"; // Usamos el icono de basura para eliminar
import { useAuth } from "../../contexts/AuthContext";
import { getPromotionsByUserId, deletePromotionById } from "../../api/auth"; // Asumiendo que existe deletePromotionById
import { Court } from "../../types/types";
import { useNavigate } from "react-router-dom";


export const PromotionsByUser: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [promotions, setPromotions] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // id de la promoción que está eliminando

  useEffect(() => {
    const fetchPromotions = async () => {
      if (!user || !user.id) return;

      try {
        setIsLoading(true);
        const data = await getPromotionsByUserId(user.id);
        setPromotions(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setError("No se pudieron cargar las promociones.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [user]);

  const handleViewPromotion = (courtId: string) => {
    navigate(`/ServicesDetailDashboard/${courtId}`);
  };

  const handleDeletePromotion = async (promotionId: string) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar esta promoción?")) return;
    if (!user?.token) {
      setError("No autorizado para eliminar la promoción.");
      return;
    }
  
    try {
      setIsDeleting(promotionId);
      await deletePromotionById({ courtId: promotionId, token: user.token });
      setPromotions((prev) => prev.filter((promo) => promo.court_id !== promotionId));
      setError(null);
    } catch (err) {
      console.error("Error eliminando promoción:", err);
      setError("No se pudo eliminar la promoción.");
    } finally {
      setIsDeleting(null);
    }
  };
 
     // Define los tipos esperados

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 max-w-4xl mx-auto my-8">
     <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {/* Si promotions[0].type es 'services', muestra 'Mis Servicios', sino 'Mis Promociones' */}
            {promotions[0]?.type === 'services' ? 'Mis Servicios' : 'Mis Promociones'}
        </h2>
    </div>

      {error && (
        <div className="text-center py-4 text-red-500 bg-red-50 rounded-md mb-4">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500 flex flex-col items-center">
          <Loader className="w-8 h-8 animate-spin mb-4" />
          Cargando promociones...
        </div>
      ) : promotions.length > 0 ? (
        <div className="space-y-4">
          {promotions.map((promo) => (
            <div
              key={promo.court_id}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 dark:border-gray-600 shadow-sm gap-4"
            >
              {/* Información de la promoción */}
              <div className="flex flex-col">
                <p className="font-bold text-gray-900 dark:text-white mb-1">{promo.court_name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{promo.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ciudad: {promo.city} | Precio: ${promo.price}
                </p>
              </div>

              {/* Botones de acción */}
              <div className="mt-4 sm:mt-0 flex space-x-2">
                <button
                  onClick={() => handleViewPromotion(promo.court_id)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ver
                </button>
                <button
                  onClick={() => handleDeletePromotion(promo.court_id)}
                  disabled={isDeleting === promo.court_id}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting === promo.court_id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600 dark:text-gray-300">
          <p>No tienes promociones registradas.</p>
        </div>
      )}
    </div>
  );
};
