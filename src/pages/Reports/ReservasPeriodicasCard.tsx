import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { getPeriodicReservations } from '../../api/auth';

export interface ReservaMensual {
    anio: number;
    mes: string;
    total_reservas: number;
}

interface Props {
    subcourtId: string;
    year?: string;
    month?: string;
}

const ReservasPeriodicasCard: React.FC<Props> = ({ subcourtId, year, month }) => {
    const [reservas, setReservas] = useState<ReservaMensual[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await getPeriodicReservations(subcourtId, { year, month });

                if (!Array.isArray(response)) {
                    setError("La API devolvió un formato inesperado");
                    return;
                }

                setReservas(response);

            } catch (err) {
                setError("Error al cargar datos");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subcourtId, year, month]);


    if (loading) {
        return (
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg text-center">
                <p>Cargando reservas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900 text-red-200 p-6 border border-red-600 rounded-xl">
                <p>{error}</p>
            </div>
        );
    }

    if (reservas.length === 0) {
        return (
            <div className="p-6 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-xl text-center">
                <p>No se encontraron reservas para esta fecha.</p>
            </div>
        );
    }


    const groupedByYear = reservas.reduce((acc, r) => {
        if (!acc[r.anio]) acc[r.anio] = [];
        acc[r.anio].push(r);
        return acc;
    }, {} as Record<number, ReservaMensual[]>);

    const sortedYears = Object.keys(groupedByYear)
        .map(Number)
        .sort((a, b) => b - a);

    return (
        <div className="bg-gray-900 text-gray-100 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-indigo-400 mr-2" />
                Reservas por Mes y Año
            </h2>

            <div className="overflow-x-auto max-h-[450px]">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left">Año-Mes</th>
                            <th className="px-4 py-2 text-left">Mes</th>
                            <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedYears.map((year) => (
                            <React.Fragment key={year}>
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="bg-indigo-900 text-indigo-200 font-bold px-4 py-2"
                                    >
                                        Año {year}
                                    </td>
                                </tr>

                                {groupedByYear[year]
                                    .sort((a, b) =>
                                        new Date(`2024-${a.mes}-01`).getMonth() -
                                        new Date(`2024-${b.mes}-01`).getMonth()
                                    )
                                    .map((r, i) => (
                                        <tr
                                            key={`${year}-${r.mes}`}
                                            className={i % 2 ? "bg-gray-800" : "bg-gray-900"}
                                        >
                                            <td className="px-4 py-2">{year}-{r.mes}</td>
                                            <td className="px-4 py-2">{r.mes}</td>
                                            <td className="px-4 py-2 text-right font-semibold">
                                                {r.total_reservas}
                                            </td>
                                        </tr>
                                    ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservasPeriodicasCard;
