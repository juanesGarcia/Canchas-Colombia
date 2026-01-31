import React, { useState, useEffect } from "react";
import { ServiceCard } from "../../components/Cards/ServiceCard";
import { getCourts } from "../../api/auth";
import { Court, Service } from "../../types/types";
import { MapPin, Search, Filter } from "lucide-react";
import { AnimatePresence, motion } from "../../utils/depencies";
import { Button } from "../../components/UI/Button";

export const Promotions: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedItems: Court[] = await getCourts();
        const fetchedServices = fetchedItems
          .filter(item => item.type === 'promotion')
          .map(item => ({
            court_id: item.court_id,
            court_name: item.court_name,
            city: item.city,
            address: item.address,
            description: item.description,
            phone: item.phone,
            photos: item.photos,
            state: item.state,
            price: item.price,
            court_type: item.court_type ,// Asegúrate de que esta propiedad existe en tu tipo Court
            type: item.type
          }));
        setServices(fetchedServices);
      } catch (err) {
        setError("No se pudieron cargar los servicios.");
        console.error("Error fetching services:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const serviceTypes = [
    { value: "all", label: "Todos los servicios" },
    { value: "equipacion", label: "Equipación" },
    { value: "entrenamiento", label: "Entrenamiento" },
    { value: "iluminacion", label: "Iluminación" },
    { value: "camerinos", label: "Camerinos" },
    { value: "arbitraje", label: "Arbitraje" },
  ];

  const priceRanges = [
    { value: "all", label: "Todos los precios" },
    { value: "low", label: "Hasta $30,000" },
    { value: "medium", label: "$30,000 - $50,000" },
    { value: "high", label: "Más de $50,000" },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.court_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesServiceType =
      selectedService === "all" || service.court_type?.toLowerCase().includes(selectedService);

    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && service.price <= 30000) ||
      (priceRange === "medium" && service.price > 30000 && service.price <= 50000) ||
      (priceRange === "high" && service.price > 50000);

    return matchesSearch && matchesServiceType && matchesPrice;
  });

  const handleSelectService = (service: Service) => {
    console.log("Contratar servicio:", service);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Promociones
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Mira todas las promociones disponibles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o ubicación..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline-solid"
              onClick={() => setShowFilters(!showFilters)}
              icon={Filter}
              iconPosition="left"
            >
              Filtros
            </Button>
          </div>
          {showFilters && (
            <AnimatePresence>
              <motion.div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rango de Precio
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedService("all");
                      setPriceRange("all");
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {filteredServices.length} promocion{filteredServices.length !== 1 ? "es" : ""} encontrada{filteredServices.length !== 1 ? "s" : ""}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Cargando servicios...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Error: {error}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.court_id}
                service={service}
                onSelect={handleSelectService}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron servicios
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Lo sentimos, no hay servicios adicionales disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
