import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';

import ClientesFrecuentesTable from './ClientesFrecuentesTable';
import ReservasPorDiaChart from './ReservasPorDiaChart';
import RecaudosPorPagoChart from './RecaudosPorPagoChart';
import ReservasPorHoraChart from './ReservasPorHoraChart';
import ReservasPeriodicasCard from './ReservasPeriodicasCard';
import HotColdHoursCard from './HotColdHoursCard';

const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// 🔥 MAPEO CORRECTO MES → NÚMERO
const monthMap: Record<string, number> = {
    Enero: 1,
    Febrero: 2,
    Marzo: 3,
    Abril: 4,
    Mayo: 5,
    Junio: 6,
    Julio: 7,
    Agosto: 8,
    Septiembre: 9,
    Octubre: 10,
    Noviembre: 11,
    Diciembre: 12
};

const PruebaChart: React.FC = () => {
    const { subcourtId } = useParams<{ subcourtId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    // filtros
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");

    // activar búsqueda manual
    const [search, setSearch] = useState(false);

    const handleGoBack = () => navigate(-1);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleSearch = () => {
        if (year === "" && month === "") return;
        setSearch(true);
    };

    const currentSubcourtId = subcourtId || "ID no disponible";

    // 🔥 Convertimos mes de texto → número
    const monthNumber = month ? String(monthMap[month]) : "";

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 p-8">
                <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-xl shadow-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="text-xl font-semibold text-indigo-700">Cargando Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-8 bg-gray-100">

            {/* HEADER */}
            <header className="mb-8">
                <button
                    onClick={handleGoBack}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition mb-4"
                >
                    <ArrowLeft className="w-6 h-6 mr-2" />
                    <span>Volver</span>
                </button>

                <h1 className="text-3xl font-extrabold text-gray-900">
                    📊 Centro de Reportes y Analíticas
                </h1>

                <p className="text-lg font-medium text-indigo-600 mt-1">
                    Subcancha: <span className="bg-indigo-100 px-2 py-1 rounded">{currentSubcourtId}</span>
                </p>
            </header>

            {/* FILTROS */}
            <div className="bg-white p-4 mb-10 rounded-xl shadow-lg flex flex-col sm:flex-row gap-4 items-end">

                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm font-semibold text-gray-700">Filtrar por Año</label>
                    <input
                        type="number"
                        placeholder="2024"
                        value={year}
                        onChange={(e) => {
                            setYear(e.target.value);
                            setSearch(false);
                        }}
                        className="mt-1 p-2 border rounded text-black"
                    />
                </div>

                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm font-semibold text-gray-700">Filtrar por Mes</label>
                    <select
                        value={month}
                        onChange={(e) => {
                            setMonth(e.target.value);
                            setSearch(false);
                        }}
                        className="mt-1 p-2 border rounded text-black"
                    >
                        <option value="">Seleccione</option>
                        {meses.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleSearch}
                    disabled={year === "" && month === ""}
                    className={`px-6 py-2 rounded-lg text-white font-semibold transition
                        ${year !== "" || month !== ""
                            ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed"}
                    `}
                >
                    Buscar
                </button>
            </div>

            <section className="mb-10">
                {search ? (
                    <>
                        {/* CHARTS SUPERIORES */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

                            <div className="lg:col-span-2">
                                <ReservasPorDiaChart
                                    subcourtId={currentSubcourtId}
                                    year={year}
                                    month={monthNumber}
                                />
                            </div>

                            <div>
                                <RecaudosPorPagoChart
                                    subcourtId={currentSubcourtId}
                                    year={year}
                                    month={monthNumber}
                                />
                            </div>

                        </section>

                        {/* SEGUNDA FILA */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

                            <div className="p-6 bg-white rounded-xl shadow-lg">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-blue-600" /> Clientes Más Frecuentes
                                </h2>
                                <ClientesFrecuentesTable
                                    subcourtId={currentSubcourtId}
                                    year={year}
                                    month={monthNumber}
                                />
                            </div>

                            <div>
                                <ReservasPorHoraChart
                                    subcourtId={currentSubcourtId}
                                    year={year}
                                    month={monthNumber}
                                />
                            </div>
                        </section>

                        {/* RESERVAS PERIÓDICAS */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                            <ReservasPeriodicasCard
                                subcourtId={currentSubcourtId}
                                year={year}
                                month={monthNumber}
                            />
                        </section>

                        {/* HOT / COLD HOURS */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <HotColdHoursCard
                                subcourtId={currentSubcourtId}
                                year={year}
                                month={monthNumber}
                            />
                        </section>
                    </>
                ) : (
                    <p className="text-center text-gray-600 mb-10 text-lg">
                        Selecciona <strong>año</strong> y <strong>mes</strong>, luego presiona <strong>Buscar</strong>.
                    </p>
                )}
            </section>

        </div>
    );
};

export default PruebaChart;
