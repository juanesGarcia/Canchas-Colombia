import React, { useState, useEffect } from "react";
import { getCourts, deleteCourt } from "../../api/auth";
import { Court } from "../../types/types";
import { Search, Filter, MapPin, Trash2 } from "lucide-react";
import { FieldCard } from "../../components/Cards/FieldCard";
import { Button } from "../../components/UI/Button";
import { AnimatePresence, motion } from "../../utils/depencies";


export const FieldsWithDelete: React.FC = () => {
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
                setCourts(fetchedCourts);
            } catch (err) {
                setError("No se pudieron cargar las canchas." + err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourts();
    }, []);

    const fieldTypes = [
        { value: "all", label: "Todos" },
        { value: "futbol", label: "Fútbol" },
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
    ];

    const priceRanges = [
        { value: "all", label: "Todos los precios" },
        { value: "low", label: "Hasta $30,000" },
        { value: "medium", label: "$30,000 - $50,000" },
        { value: "high", label: "Más de $50,000" },
    ];

    const filteredFields = courts.filter((court) => {
        const matchesTypeCourt = court.type === "court";
        const matchesSearch =
            court.court_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            court.city?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
            selectedType === "all" ||
            court.court_type?.toLowerCase().includes(selectedType);

        const matchesPrice =
            priceRange === "all" ||
            (priceRange === "low" && court.price <= 30000) ||
            (priceRange === "medium" &&
                court.price > 30000 &&
                court.price <= 50000) ||
            (priceRange === "high" && court.price > 50000);

        const matchesCity =
            selectedCity === "all" ||
            court.city?.toLowerCase() === selectedCity.toLowerCase();

        return matchesTypeCourt && matchesSearch && matchesType && matchesPrice && matchesCity;
    });

    const handleDelete = async (courtId: string) => {
        if (!confirm("¿Seguro que quieres eliminar esta cancha?")) return;

        const ok = await deleteCourt(courtId);

        if (ok) {
            setCourts((prev) =>
                prev.filter((court) => court.court_id !== courtId)
            );
        } else {
            alert("No se pudo eliminar la cancha");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Nuestras Canchas
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full pl-10 pr-4 py-2 border rounded-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline-solid"
                            onClick={() => setShowFilters(!showFilters)}
                            icon={Filter}
                        >
                            Filtros
                        </Button>
                    </div>

                    {showFilters && (
                        <AnimatePresence>
                            <motion.div className="mt-6 grid grid-cols-3 gap-4">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    {fieldTypes.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                >
                                    {priceRanges.map((p) => (
                                        <option key={p.value} value={p.value}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                >
                                    {cities.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Results */}
                {isLoading ? (
                    <p>Cargando...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : filteredFields.length > 0 ? (
                    <div className="grid grid-cols-3 gap-8">
                        {filteredFields
                            .filter(field => field.state === true)
                            .map((field) => (
                                <div key={field.court_id} className="relative">
                                    <FieldCard field={field} onBook={() => { }} />
                                    {/* BOTÓN ELIMINAR */}
                                    <button
                                        onClick={() => handleDelete(field.court_id)}
                                        className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <MapPin className="w-16 h-16 mx-auto mb-4 text-green-400" />
                        <p>No se encontraron canchas</p>
                    </div>
                )}
            </div>
        </div>
    );
};