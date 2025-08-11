import { useState, useEffect } from "react";
import { getCourts } from "../../api/auth";
import { Court } from "../../types/types";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Star, Users } from "lucide-react";
import { Button } from "../../components/UI/Button";
import { FieldCard } from "../../components/Cards/FieldCard";
import { ServiceCard } from "../../components/Cards/ServiceCard";
import { SERVICES } from "../../constants";
import { FC } from "../../utils/depencies";


export const Home: FC = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const fetchedCourts = await getCourts();
        setCourts(fetchedCourts);
      } catch (err) {
        setError("No se pudieron cargar las canchas.");
        console.error("Error fetching courts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourts();
  }, []);

  const featuredFields = courts.slice(0, 3);
  const featuredServices = SERVICES.slice(0, 3);

  const features = [
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description:
        "Instalaciones seguras con protocolos de limpieza y seguridad",
    },
    {
      icon: Clock,
      title: "Reservas 24/7",
      description: "Reserva tu cancha en cualquier momento del día",
    },
    {
      icon: Star,
      title: "Calidad Premium",
      description: "Canchas de alta calidad con el mejor equipamiento",
    },
    {
      icon: Users,
      title: "Para Todos",
      description: "Espacios para deportes recreativos y profesionales",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -bg-conic-120 from-green-800 to-green-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tu Espacio Deportivo
              <span className="block text-green-200">Ideal</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Descubre y reserva las mejores canchas deportivas de la ciudad.
              Calidad, comodidad y precios increíbles te esperan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/fields">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Ver Canchas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Ofrecemos la mejor experiencia deportiva con servicios de calidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Fields */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Canchas Destacadas
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Las mejores canchas para tu práctica deportiva
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && (
            <div className="col-span-full text-center text-gray-500">
              Cargando canchas...
            </div>
          )}
          {error && (
            <div className="col-span-full text-center text-red-500">
              Error: {error}
            </div>
          )}
          {!isLoading && !error && featuredFields.length > 0 && featuredFields.map((field) => (
            <FieldCard key={field.court_id} field={field} />
          ))}
          {!isLoading && !error && featuredFields.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No hay canchas destacadas disponibles.
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link to="/fields">
            <Button
              variant="outline-solid"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
            >
              Ver Todas las Canchas
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Services */}
      <section className=" py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Servicios Adicionales
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Completa tu experiencia deportiva con nuestros servicios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button
                variant="outline-solid"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
              >
                Ver Todos los Servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para jugar?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Únete a miles de deportistas que ya confían en nosotros
          </p>
          <Link to="/register">
            <Button variant="outline-solid" size="lg">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};