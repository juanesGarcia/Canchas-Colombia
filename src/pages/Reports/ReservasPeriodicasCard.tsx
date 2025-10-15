import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

// NOTA: Asegúrate de que esta ruta y el nombre de la función sean correctos
import { getPeriodicReservations } from '../../api/auth'; 


export interface ReservaMensual {
    ano: string;
    mes_nombre: string;
    mes_numero: string; // Útil para ordenamiento interno
    total_reservas: string; // Viene como string "3"
}

interface ReservasChartProps {
    subcourtId: string; // ¡Esta es la clave!
}
const ReservasPeriodicasCard: React.FC <ReservasChartProps>= ({ subcourtId }) => {


    const [reservas, setReservas] = useState<ReservaMensual[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Efecto para cargar los datos
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Lógica de fetch que asume que la función existe y usa la nueva interfaz
                const data = await getPeriodicReservations(subcourtId);
                setReservas(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar los datos.";
                console.error("Fallo al cargar reservas mensuales:", err);
                setError(`No se pudieron cargar las reservas mensuales: ${errorMessage}`);
                setReservas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subcourtId]);


    // --- Renderizado Condicional de Estado ---

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg h-full flex items-center justify-center min-h-[180px]">
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500">Cargando reporte de reservas mensuales...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 p-6 border border-red-400 text-red-700 rounded-xl shadow-lg h-full flex items-center justify-center min-h-[180px]">
                <p>Error de Carga: {error}</p>
            </div>
        );
    }
    
    if (reservas.length === 0) {
        return (
            <div className="bg-yellow-100 p-6 border border-yellow-400 text-yellow-700 rounded-xl shadow-lg h-full flex items-center justify-center min-h-[180px]">
                <p>No se encontraron datos de reservas mensuales para el ID {targetId}.</p>
            </div>
        );
    }


    // Agrupar los datos por año para mostrar encabezados de sección
    const groupedByYear = reservas.reduce((acc, reserva) => {
        const year = reserva.ano;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(reserva);
        return acc;
    }, {} as Record<string, ReservaMensual[]>);

    // Ordenar los años de forma descendente para que el más reciente aparezca primero
    const sortedYears = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));


    // --- Renderizado Principal ---
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                Reporte de Reservas Mensuales Detalladas
            </h2>
            
            <div className="overflow-x-auto max-h-[500px]"> {/* Altura máxima para hacerlo desplazable */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                Período
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                Mes
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                                Total de Reservas
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedYears.map(year => (
                            <React.Fragment key={year}>
                                {/* Encabezado de Año */}
                                <tr>
                                    <td colSpan={3} className="px-6 py-2 text-lg font-extrabold text-indigo-700 bg-indigo-50 border-t-2 border-indigo-200 sticky top-0 z-10">
                                        Año {year}
                                    </td>
                                </tr>
                                {/* Filas de Meses */}
                                {
                                    // Ordenar los meses para el renderizado (por mes_numero)
                                    groupedByYear[year].sort((a, b) => parseInt(a.mes_numero) - parseInt(b.mes_numero))
                                    .map((reserva, index) => (
                                    <tr 
                                        key={`${reserva.ano}-${reserva.mes_numero}`} 
                                        className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 hover:bg-gray-50 transition duration-150'}
                                    >
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {reserva.ano}-{reserva.mes_numero}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {reserva.mes_nombre}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-bold text-indigo-600">
                                            {
                                                // Convertimos a número antes de formatear
                                                parseInt(reserva.total_reservas).toLocaleString()
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
                Datos agrupados por año y mes de todas las reservas de la subcancha {subcourtId}.
            </p>
        </div>
    );
};

export default ReservasPeriodicasCard;
