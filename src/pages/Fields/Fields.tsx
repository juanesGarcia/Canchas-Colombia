import React, { useState, useEffect } from "react";
import { getCourts } from "../../api/auth";
import { Court } from "../../types/types";
import { Search, Filter, MapPin } from "lucide-react";
import { FieldCard } from "../../components/Cards/FieldCard";
import { Button } from "../../components/UI/Button";
import { AnimatePresence, motion } from "../../utils/depencies";

export const Fields: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const fetchedCourts = await getCourts();
        console.log(fetchedCourts);
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

  const fieldTypes = [
    { value: "all", label: "Todos" },
    { value: "futbol", label: "futbol" },
    { value: "basketball", label: "Básquet" },
    { value: "tennis", label: "Tenis" },
    { value: "volleyball", label: "Voleibol" },
  ];
  const cities = [
    { value: "all", label: "Todos" },
    { value: "Bogota", label: "Bogotá" },
    { value: "Medellín", label: "Medellín" },
    { value: "Cali", label: "Cali" },
    { value: "Barranquilla", label: "Barranquilla" },
    { value: "Cartagena", label: "Cartagena" },
     { value: "Santa Marta", label: "Santa Marta" }
  ];
  const priceRanges = [
    { value: "all", label: "Todos los precios" },
    { value: "low", label: "Hasta $30,000" },
    { value: "medium", label: "$30,000 - $50,000" },
    { value: "high", label: "Más de $50,000" },
  ];

  const filteredFields = courts.filter((court) => {
    const matchesSearch =
      court.court_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.city?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType =
      selectedType === "all" || court.court_type?.toLowerCase().includes(selectedType);
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && court.price <= 30000) ||
      (priceRange === "medium" && court.price > 30000 && court.price <= 50000) ||
      (priceRange === "high" && court.price > 50000);

    const matchesCity =
      selectedCity === "all" || court.city?.toLowerCase() === selectedCity.toLowerCase();
    const isCourt = court.type === "court";

    return (
      matchesSearch &&
      matchesType &&
      matchesPrice &&
      matchesCity &&
      isCourt
    );
  });
  const handleBookField = (court: Court) => {
    console.log("Reservar cancha:", court);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestras Canchas
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Encuentra la cancha perfecta para tu práctica deportiva
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Cancha
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {fieldTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ciudad
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    {cities.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedType("all");
                      setPriceRange("all");
                      setSelectedCity("all");
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
            {filteredFields.filter(f => f.state).length} cancha
            {filteredFields.filter(f => f.state).length !== 1 ? "s" : ""} encontrada
            {filteredFields.filter(f => f.state).length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Fields Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Cargando canchas...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Error: {error}
          </div>
        ) : filteredFields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFields
              .filter(field => field.state === true)
              .map((field) => (
                <FieldCard
                  key={field.court_id}
                  field={field}
                  onBook={handleBookField}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron canchas
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Intenta ajustar los filtros o buscar con otros términos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};