import { useParams } from "react-router-dom";

import { Field } from "../../../types";
import { FIELDS } from "../../../constants";
import { FieldDetail } from "../../../components/Cards/FieldCardDetail";

export const FieldDetailPage = () => {
  const { id } = useParams();
  const field = FIELDS.find((f) => f.id === id);

  const handleBook = (field: Field) => {
    // Lógica de reserva
    console.log("Reservando:", field);
  };

  if (!field) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Cancha no encontrada
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          La cancha que buscas no existe o ha sido removida
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <FieldDetail field={field} onBook={handleBook} />
    </div>
  );
};
