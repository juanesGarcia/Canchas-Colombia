import React, { useMemo } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- TIPOS Y MOCK DATA (Consulta 2: Cantidad de Reservas por Hora) ---

interface ReservasPorHora {
  hora: number; // 0 a 23
  total_reservas: number;
}

// Datos simulados (picos en las horas de la tarde)
const mockReservasPorHora: ReservasPorHora[] = [
    { hora: 8, total_reservas: 15 },
    { hora: 9, total_reservas: 30 },
    { hora: 10, total_reservas: 45 },
    { hora: 11, total_reservas: 60 },
    { hora: 12, total_reservas: 80 },
    { hora: 13, total_reservas: 110 }, // Pico 1 (Almuerzo)
    { hora: 14, total_reservas: 95 },
    { hora: 15, total_reservas: 70 },
    { hora: 16, total_reservas: 130 }, // Pico 2 (Tarde)
    { hora: 17, total_reservas: 180 }, // Pico 3 (Salida)
    { hora: 18, total_reservas: 150 },
    { hora: 19, total_reservas: 100 },
    { hora: 20, total_reservas: 50 },
];

// --- COMPONENTE ---

const ReservasPorHoraChart: React.FC = () => {
    // Lógica para preparar los datos de Chart.js
    const data = useMemo(() => {
        // Aseguramos que todas las horas de 8 a 20 estén presentes
        const fullRangeData = Array.from({ length: 13 }, (_, i) => {
            const hour = i + 8;
            const existing = mockReservasPorHora.find(d => d.hora === hour);
            return existing ? existing : { hora: hour, total_reservas: 0 };
        });

        return {
            labels: fullRangeData.map(d => `${d.hora}:00`),
            datasets: [
                {
                    label: 'Reservas',
                    data: fullRangeData.map(d => d.total_reservas),
                    fill: true,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red light area
                    borderColor: 'rgb(239, 68, 68)', // Red line
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(239, 68, 68)',
                    pointRadius: 5,
                    borderWidth: 2,
                },
            ],
        }
    }, []);

    // Opciones del gráfico de líneas
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Cantidad de Reservas por Hora (Tendencia de Demanda - Consulta 2)',
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

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg h-[400px]">
            <Line options={options as any} data={data} />
        </div>
    );
};

export default ReservasPorHoraChart;
