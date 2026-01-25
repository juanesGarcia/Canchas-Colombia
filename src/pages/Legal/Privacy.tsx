import React from "react";

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Protección de tu información personal
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
            En nuestra plataforma de reservas deportivas, valoramos tu
            privacidad y nos comprometemos a proteger tus datos personales.
            Esta Política de Privacidad explica cómo recopilamos, usamos y
            protegemos tu información.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            1. Información que recopilamos
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Datos de identificación: nombre, documento, teléfono.</li>
            <li>Información de reservas: fechas, horas, duración y pagos.</li>
            <li>Datos de uso: actividad dentro de la plataforma.</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            2. Finalidad del uso de datos
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Gestionar reservas y pagos.</li>
            <li>Generar estadísticas para administradores.</li>
            <li>Mejorar el funcionamiento del sistema.</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            3. Protección de la información
          </h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger tus
            datos frente a accesos no autorizados, pérdida o alteración.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            4. Compartición de datos
          </h2>
          <p>
            No compartimos tu información con terceros, salvo obligación legal
            o autorización expresa del usuario.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            5. Derechos del usuario
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Conocer, actualizar y corregir tus datos.</li>
            <li>Solicitar la eliminación de tu información.</li>
            <li>Revocar el consentimiento de uso.</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            6. Conservación de datos
          </h2>
          <p>
            Conservaremos la información únicamente durante el tiempo necesario
            para cumplir con las finalidades del servicio.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            7. Cambios en la política
          </h2>
          <p>
            Esta política puede ser actualizada. Los cambios serán publicados en
            esta misma sección.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            8. Contacto
          </h2>
          <p>
            Para cualquier solicitud relacionada con tus datos, puedes
            comunicarte por los canales oficiales de la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
};
