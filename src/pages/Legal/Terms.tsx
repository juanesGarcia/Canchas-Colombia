import React from "react";

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Condiciones de uso del software de reservas deportivas
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
            Bienvenido a nuestra plataforma de gestión y reservas de espacios
            deportivos. Al acceder o utilizar nuestro software, aceptas cumplir
            con los siguientes Términos y Condiciones.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            1. Descripción del servicio
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Reservar canchas y espacios deportivos.</li>
            <li>Gestionar horarios, pagos y disponibilidad.</li>
            <li>Brindar acceso a estadísticas e información de reservas.</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            2. Uso del sistema
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Manipular o alterar datos del sistema.</li>
            <li>Usar información de terceros sin autorización.</li>
            <li>Acceder a cuentas o datos que no te pertenezcan.</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            3. Cuentas y seguridad
          </h2>
          <p>
            El usuario es responsable de mantener la confidencialidad de su
            cuenta y contraseña.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            4. Información y estadísticas
          </h2>
          <p>
            Los reportes son solo para fines internos de gestión.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            5. Pagos y facturación
          </h2>
          <p>
            El servicio puede requerir pagos por suscripción o licencia.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            6. Privacidad
          </h2>
          <p>
            El uso de datos se rige por nuestra Política de Privacidad.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            7. Disponibilidad
          </h2>
          <p>
            No garantizamos disponibilidad continua del sistema.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            8. Modificaciones
          </h2>
          <p>
            Podemos actualizar estos términos en cualquier momento.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            9. Contacto
          </h2>
          <p>
            Puedes comunicarte con nosotros desde la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
};
