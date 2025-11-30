import React, { useMemo, useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { getReservationsByDay } from '../../api/auth';

interface ReservationDay {
    dia_semana: string;
    orden: number;
    total_reservas: number;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReservasChartProps {
    subcourtId: string;
    year: string;   // ← agregado
    month: string;  // ← agregado
}

const ReservasPorDiaChart: React.FC<ReservasChartProps> = ({ subcourtId, year, month }) => {

    const [reservationsData, setReservationsData] = useState<ReservationDay[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar los datos cada vez que cambie el filtro
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getReservationsByDay(subcourtId, { year, month });
                setReservationsData(data);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Error desconocido.";
                setError(message);
                setReservationsData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subcourtId, year, month]);

    const chartData = useMemo(() => {
        const sorted = [...reservationsData].sort((a, b) => a.orden - b.orden);

        return {
            labels: sorted.map(d => d.dia_semana),
            datasets: [
                {
                    label: "Reservas",
                    data: sorted.map(d => d.total_reservas),
                    backgroundColor: "rgba(59,130,246,0.8)",
                    borderColor: "rgb(59,130,246)",
                }
            ]
        };
    }, [reservationsData]);

        // Render condicional según estado
    if (loading) {
        return (
            <div className="p-6 bg-gray-100 text-gray-800 rounded-xl shadow-lg text-center">
                <p>Cargando reservas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 text-red-800 border border-red-400 rounded-xl text-center">
                <p>Error al cargar reservas: {error}</p>
            </div>
        );
    }

    if (reservationsData.length === 0) {
        return (
            <div className="p-6 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-xl text-center">
                <p>No se encontraron reservas para esta fecha.</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg h-[450px]">
            <Bar data={chartData} />
        </div>
    );
};

export default ReservasPorDiaChart;
