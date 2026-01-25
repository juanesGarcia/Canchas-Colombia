import React from "react";

export const Cancellation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Política de Cancelación
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Condiciones para cancelar y reprogramar reservas
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">

          <p className="text-center text-xs text-gray-500">
            Última actualización: {new Date().toLocaleDateString()}
          </p>

          <p>
            Esta Política de Cancelación regula las condiciones bajo las cuales
            los usuarios pueden cancelar reservas realizadas a través de nuestra
            plataforma de gestión y reservas deportivas.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            1. Cancelaciones por parte del usuario
          </h2>
          <p>
            Las reservas podrán cancelarse con un mínimo de
            <strong> 24 horas de anticipación</strong> antes de la hora
            programada.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            2. Cancelaciones fuera de tiempo
          </h2>
          <p>
            Si la cancelación se realiza con menos de 24 horas de anticipación,
            no se realizará reembolso.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            3. No asistencia
          </h2>
          <p>
            Si el usuario no se presenta, la reserva será marcada como
            <strong> no asistida</strong> y no habrá devolución.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            4. Cancelaciones del establecimiento
          </h2>
          <p>
            El establecimiento podrá cancelar por causas de fuerza mayor
            (clima, mantenimiento, eventos), ofreciendo reprogramar o
            reembolsar.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            5. Reembolsos
          </h2>
          <p>
            Los reembolsos se realizarán por el mismo medio de pago dentro de
            un plazo de 5 a 10 días hábiles.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            6. Modificaciones
          </h2>
          <p>
            Las reservas solo podrán modificarse una vez y estarán sujetas
            a disponibilidad.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            7. Aceptación
          </h2>
          <p>
            Al reservar, el usuario acepta esta Política de Cancelación.
          </p>
        </div>
      </div>
    </div>
  );
};


