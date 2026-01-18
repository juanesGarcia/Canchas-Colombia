import React, { useMemo, useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

import { getRevenueByPaymentMethod } from '../../api/auth';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface DetailedRevenue {
    payment_method: string;
    total_reservas: number;
    recaudo_total: string;
    medio_pago: string;
}

const PALETA_COLORES = [
    'rgb(245, 158, 11)',  // Amber
    'rgb(59, 130, 246)',  // Blue
    'rgb(16, 185, 129)',  // Emerald
    'rgb(168, 85, 247)',  // Violet
];

interface RecaudosPorPagoChartProps {
    subcourtId: string;
    year?: string;
    month?: string;
}

const RecaudosPorPagoChart: React.FC<RecaudosPorPagoChartProps> = ({ subcourtId, year, month }) => {
    const [recaudosData, setRecaudosData] = useState<DetailedRevenue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para convertir mes texto a número
    const getMonthNumber = (monthName: string): number => {
        const date = new Date(`${monthName} 1, 2024`);
        return date.getMonth() + 1;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Preparar filtros año/mes
                const filters: any = {};
                if (year) filters.year = year;
                if (month) filters.month = getMonthNumber(month);

                const data = await getRevenueByPaymentMethod(subcourtId, {year, month });
                // Filtrar nulos y limpiar array
                const cleanedData = Array.isArray(data) ? data.filter(d => d != null) : [];
                setRecaudosData(cleanedData);
            } catch (err) {
                console.error("Error al obtener recaudo:", err);
                setError("Ocurrió un error al cargar los datos de recaudo.");
                setRecaudosData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subcourtId, year, month]);

    const { chartData, totalRecaudo, options } = useMemo(() => {
        const filteredData = recaudosData.filter(
            d => d && d.medio_pago && d.medio_pago.toLowerCase() !== 'total general'
        );

        const total = filteredData.reduce((sum, d) => sum + Number(d.recaudo_total), 0);

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: {
                legend: {
                    position: 'bottom' as const,
                    labels: { usePointStyle: true, padding: 20, font: { size: 12 } }
                },
                title: {
                    display: true,
                    text: 'Recaudo por Método de Pago',
                    font: { size: 18, weight: '700' }
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const currentValue = context.raw;
                            const percentage = total > 0 ? ((currentValue / total) * 100).toFixed(1) : '0.0';
                            const formattedValue = currentValue.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
                            return `${context.label}: ${formattedValue} (${percentage}%)`;
                        }
                    }
                }
            }
        };

        const dataForChart = {
            labels: filteredData.map(d => d.medio_pago),
            datasets: [
                {
                    label: 'Recaudo Total',
                    data: filteredData.map(d => Number(d.recaudo_total)),
                    backgroundColor: PALETA_COLORES.slice(0, filteredData.length).map(c => c.replace('rgb', 'rgba').replace(')', ', 0.8)')),
                    borderColor: PALETA_COLORES.slice(0, filteredData.length),
                    borderWidth: 2,
                }
            ]
        };

        return { chartData: dataForChart, totalRecaudo: total, options: chartOptions };
    }, [recaudosData]);

    const BaseCard = ({ children }: { children: React.ReactNode }) => (
        <div className="p-6 bg-white rounded-xl shadow-2xl border border-gray-100 h-[450px] w-full flex flex-col items-center justify-center font-sans">
            {children}
        </div>
    );

    if (loading) {
        return (
            <BaseCard>
                <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    <p className="text-lg text-gray-600">Cargando la distribución de pagos...</p>
                </div>
            </BaseCard>
        );
    }

    if (error) {
        return (
            <BaseCard>
                <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg text-center">
                    <p className="font-bold mb-1">Error de Conexión</p>
                    <p className="text-sm">{error}</p>
                </div>
            </BaseCard>
        );
    }

    if (recaudosData.length === 0) {
        return (
            <div className="p-6 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-xl text-center">
                <p>No se encontraron reservas para esta fecha.</p>
            </div>
        );
    }

    return (
        <BaseCard>
            <div className="w-full max-w-md h-full max-h-[400px] relative">
                <Doughnut options={options as any} data={chartData} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-sm text-gray-500 mb-1">Total General</p>
                    <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                        {totalRecaudo.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })}
                    </p>
                </div>
            </div>
        </BaseCard>
    );
};

export default RecaudosPorPagoChart;
