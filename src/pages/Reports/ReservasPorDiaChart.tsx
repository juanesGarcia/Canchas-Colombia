import React, { useMemo } from 'react';
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

// Registrar componentes necesarios (asegura que solo se haga una vez en la aplicación)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- TIPOS Y MOCK DATA (Consulta 1) ---

interface ReservasPorDia {
  dia_semana: string;
  orden: number;
  total_reservas: number;
}

const mockReservasDia: ReservasPorDia[] = [
  { dia_semana: 'Lunes', orden: 1, total_reservas: 85 },
  { dia_semana: 'Martes', orden: 2, total_reservas: 120 },
  { dia_semana: 'Miércoles', orden: 3, total_reservas: 95 },
  { dia_semana: 'Jueves', orden: 4, total_reservas: 150 },
  { dia_semana: 'Viernes', orden: 5, total_reservas: 210 },
  { dia_semana: 'Sábado', orden: 6, total_reservas: 250 },
  { dia_semana: 'Domingo', orden: 7, total_reservas: 180 },
].sort((a, b) => a.orden - b.orden);

// --- COMPONENTE ---

const ReservasPorDiaChart: React.FC = () => {
    // Lógica para preparar los datos de Chart.js
    const data = useMemo(() => ({
        labels: mockReservasDia.map(d => d.dia_semana),
        datasets: [
            {
                label: 'Total de Reservas',
                data: mockReservasDia.map(d => d.total_reservas),
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // Indigo
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    }), []);

    // Opciones del gráfico de barras
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Reservas por Día de la Semana (Consulta 1)',
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

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg h-96">
            <Bar options={options as any} data={data} />
        </div>
    );
};

export default ReservasPorDiaChart;
