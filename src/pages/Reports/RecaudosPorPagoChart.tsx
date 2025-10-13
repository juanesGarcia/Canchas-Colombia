import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Registrar componentes necesarios
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- TIPOS Y MOCK DATA (Consulta 6) ---

interface RecaudosPorPago {
  medio_pago: string;
  recaudo_total: number;
}

const mockRecaudos: RecaudosPorPago[] = [
  { medio_pago: 'Transferencia / Digital', recaudo_total: 125000 },
  { medio_pago: 'Efectivo / Otros', recaudo_total: 75000 },
];

// --- COMPONENTE ---

const RecaudosPorPagoChart: React.FC = () => {
    // Lógica para preparar los datos de Chart.js
    const data = useMemo(() => ({
        labels: mockRecaudos.map(d => d.medio_pago),
        datasets: [
            {
                label: 'Recaudo Total',
                data: mockRecaudos.map(d => d.recaudo_total),
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)', // Transferencia: Emerald
                    'rgba(245, 158, 11, 0.8)', // Efectivo: Amber
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                ],
                borderWidth: 2,
            },
        ],
    }), []);

    // Opciones del gráfico de rosquilla
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%', 
        plugins: {
            legend: { position: 'bottom' as const, labels: { usePointStyle: true, padding: 20 } },
            title: {
                display: true,
                text: 'Distribución de Recaudos (Consulta 6)',
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const currentValue = context.raw;
                        const percentage = ((currentValue / total) * 100).toFixed(1);
                        return `${context.label}: $${currentValue.toLocaleString('es-CL')} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg h-96 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm h-full max-h-[300px] relative">
                <Doughnut options={options as any} data={data} />
            </div>
        </div>
    );
};

export default RecaudosPorPagoChart;
