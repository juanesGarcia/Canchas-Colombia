import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { COMPANY_INFO } from '../../constants';
import Swal from 'sweetalert2';
import {Map} from "../Map/Map";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { name, email, phone, subject, message } = formData;
    const myWhatsappNumber = '573186699925';

    const whatsappMessage = `
    ¡Hola! 👋

    Tengo un mensaje de contacto a través de la página web. Aquí están los detalles:

    Nombre: ${name}
    Email: ${email}
    Teléfono: ${phone}
    Asunto: ${subject}

    Mensaje:
    ${message}

    ¡Espero tu respuesta!
    `;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${myWhatsappNumber}?text=${encodedMessage}`;

    // Paso 1: Redirigir a WhatsApp
    window.location.href = whatsappUrl;

    // Simula el tiempo que el usuario podría tomar en WhatsApp y volver
    // Para que la alerta se muestre de forma asíncrona después de la redirección
    setTimeout(() => {
        // Paso 2: Mostrar la alerta de éxito al regresar
        Swal.fire({
            icon: 'success',
            title: '¡Mensaje enviado!',
            text: 'Tu mensaje ha sido enviado a WhatsApp. Revisa la conversación para confirmar el envío.',
            confirmButtonText: 'Aceptar'
        });
    }, 2000); // 2 segundos de retraso para simular la vuelta del usuario

  } catch (error) {
    // Si hay un error (por ejemplo, si la redirección falla por alguna razón)
    Swal.fire({
      icon: 'error',
      title: 'Error al enviar',
      text: 'Hubo un problema al intentar abrir WhatsApp. Por favor, inténtalo de nuevo.'+error,
      confirmButtonText: 'Aceptar'
    });
  } finally {
    setLoading(false);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  }
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Contáctanos
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Estamos aquí para ayudarte con todas tus necesidades deportivas
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Información de Contacto
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Teléfono</h3>
                    <p className="text-gray-600 dark:text-gray-400">{COMPANY_INFO.phone}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Lunes a Domingo, 7AM - 8PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">{COMPANY_INFO.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Respuesta en 24 horas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Dirección</h3>
                    <p className="text-gray-600 dark:text-gray-400">{COMPANY_INFO.address}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Zona Sur, Bogotá</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Horarios</h3>
                    <div className="text-gray-600 dark:text-gray-400">
                      <p>Lunes - Viernes: 7:00 AM - 8:00 PM</p>
                      <p>Sábados - Domingos: 7:00 AM - 9:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64">
            <div className="h-full w-full">
              <Map address="Calle 48csur #25-94" />
            </div>
          </div>
        </div>
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Envíanos un Mensaje
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Tu teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Asunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="reserva">Consulta sobre reservas</option>
                    <option value="precios">Información de precios</option>
                    <option value="servicios">Servicios adicionales</option>
                    <option value="evento">Eventos especiales</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Escribe tu mensaje aquí..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={Send}
                  iconPosition="right"
                  className="w-full"
                >
                  Enviar Mensaje
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};