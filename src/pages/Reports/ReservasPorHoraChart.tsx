import React, { useMemo, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Asume que la función de API está disponible
// Si el archivo de funciones de API se llama 'analytics_api.ts', la importación sería:
import { getReservationsByHour } from '../../api/auth'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- TIPOS DE DATOS REALES (Consulta 2: Cantidad de Reservas por Hora) ---

// Tipo de dato que retorna el backend: hora en formato string "HH24"
interface ReservationHour {
  hora_inicio: string; // Ejemplo: "18"
  total_reservas: number;
}

// Tipo de dato para el gráfico, donde la hora es parseada a número
interface ChartDataPoint {
    hora: number; 
    total_reservas: number;
}
interface ReservasChartProps {
    subcourtId: string; // ¡Esta es la clave!
}


// Se elimina la interfaz de Props y el componente ya no recibe props
const ReservasPorHoraChart: React.FC <ReservasChartProps>= ({ subcourtId }) => {

    const [reservationsData, setReservationsData] = useState<ReservationHour[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Efecto para cargar los datos al montar el componente
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                // Llamada a la función de API con el ID fijo
                const data = await getReservationsByHour(subcourtId);
                setReservationsData(data);
            } catch (err) {
                console.error("Fallo al cargar reservas por hora:", err);
                setError("No se pudieron cargar los datos de demanda por hora.");
                setReservationsData([]);
            } finally {
                setLoading(false);
            }
        };

        // El fetch se ejecuta una vez al montar, ya que el ID es constante.
        fetchReservations();
        
        // La dependencia `subCourtId` se elimina o se ignora ya que es una constante interna.
        // Añadimos solo `[]` como dependencia para que se ejecute una única vez.
    }, []); 


    // 2. Lógica para transformar los datos para Chart.js
    const chartData = useMemo(() => {
        // Rango de horas a mostrar (00 a 23)
        const allHours: ChartDataPoint[] = Array.from({ length: 24 }, (_, i) => ({ 
            hora: i, 
            total_reservas: 0 
        }));

        // Mapear los datos de la API a la estructura del gráfico
        reservationsData.forEach(item => {
            // hora_inicio es un string "HH24"
            const hourNumber = parseInt(item.hora_inicio, 10); 
            const existingHour = allHours.find(d => d.hora === hourNumber);
            
            if (existingHour) {
                existingHour.total_reservas = item.total_reservas;
            }
        });

        // Filtramos para visualizar solo el rango operativo (8:00 a 20:00)
        const operationalHours = allHours.filter(d => d.hora >= 8 && d.hora <= 20); 
        
        return {
            labels: operationalHours.map(d => `${d.hora}:00`),
            datasets: [
                {
                    label: 'Reservas',
                    data: operationalHours.map(d => d.total_reservas),
                    fill: true,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red light area
                    borderColor: 'rgb(239, 68, 68)', // Red line
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(239, 68, 68)',
                    pointRadius: 5,
                    borderWidth: 2,
                },
            ],
        };
    }, [reservationsData]);

    // Opciones del gráfico de líneas (se actualiza el título para reflejar el ID quemado)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: `Cantidad de Reservas por Hora (Subcancha ID: ${subcourtId})`,
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.parsed.y.toLocaleString()} reservas a las ${context.label}`,
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

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-lg h-[400px] flex items-center justify-center">
                <p className="text-gray-500">Cargando datos de demanda...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg h-[400px] flex items-center justify-center">
                <p>{error}</p>
            </div>
        );
    }
    
    // Si no hay datos después de cargar
    if (reservationsData.length === 0 && !loading) {
        return (
            <div className="p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl shadow-lg h-[400px] flex items-center justify-center">
                <p>No se encontraron datos de reservas por hora para esta subcancha (ID: {subCourtId}).</p>
            </div>
        );
    }


    return (
        <div className="p-4 bg-white rounded-xl shadow-lg h-[400px]">
            <Line options={options as any} data={chartData} />
        </div>
    );
};

export default ReservasPorHoraChart;
