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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ReservasChartProps {
    subcourtId: string; // ¡Esta es la clave!
}

const ReservasPorDiaChart: React.FC <ReservasChartProps>= ({ subcourtId }) => {
    // **VARIABLE QUEMADA (Hardcoded ID)**

    const [reservationsData, setReservationsData] = useState<ReservationDay[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Efecto para cargar los datos al montar el componente (Patrón solicitado)
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                // Llamada a la función de API con el ID fijo
                const data = await getReservationsByDay(subcourtId);
                setReservationsData(data);
            } catch (err) {
                // Captura el error de la llamada al backend
                const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar los datos.";
                console.error("Fallo al cargar reservas por día:", err);
                setError(`No se pudieron cargar los datos de reservas por día: ${errorMessage}`);
                setReservationsData([]);
            } finally {
                setLoading(false);
            }
        };

        // El fetch se ejecuta una vez al montar
        fetchReservations();
        
        // Dependencia vacía para que se ejecute solo al montar el componente
    }, [subcourtId]); 

    // 2. Lógica para preparar los datos de Chart.js
    const chartData = useMemo(() => {
        // Ordenar los datos por 'orden' (1=Lunes, 7=Domingo) si la API lo proporciona, 
        // lo cual es crucial para una gráfica de días de la semana.
        const sortedData = [...reservationsData].sort((a, b) => a.orden - b.orden);

        return {
            labels: sortedData.map(d => d.dia_semana),
            datasets: [
                {
                    label: 'Total de Reservas',
                    data: sortedData.map(d => d.total_reservas),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)', // Tailwind Indigo 500
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1,
                    borderRadius: 4,
                },
            ],
        };
    }, [reservationsData]);

    // Opciones del gráfico de barras
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: `Reservas por Día de la Semana (Subcancha ID: ${subcourtId})`,
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.parsed.y.toLocaleString()} reservas`,
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Cantidad de Reservas' }
            }
        }
    };

    // --- Renderizado Condicional ---

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-lg h-[400px] flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500">Cargando datos de reservas por día...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg h-[400px] flex items-center justify-center">
                <p>Error: {error}</p>
            </div>
        );
    }
    
    if (reservationsData.length === 0 && !loading) {
        return (
            <div className="p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl shadow-lg h-[400px] flex items-center justify-center">
                <p>No se encontraron datos de reservas por día para esta subcancha (ID: {subCourtId}).</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg h-[400px]">
            <Bar options={options as any} data={chartData} />
        </div>
    );
};

export default ReservasPorDiaChart;
