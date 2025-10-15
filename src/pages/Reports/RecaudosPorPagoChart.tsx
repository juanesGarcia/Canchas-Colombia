import React, { useMemo, useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Importación real de la API
import { getRevenueByPaymentMethod } from '../../api/auth';

// Registrar componentes necesarios de Chart.js
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// --- TIPOS CORREGIDOS ---
// La interfaz se ajusta a la data recibida: 'payment_method' en lugar de 'metodo_pago'
// y los valores numéricos se definen como 'string' ya que así llegan de la API.
interface DetailedRevenue {
    payment_method: string;
    total_reservas: string;
    recaudo_total: string;
}

const PALETA_COLORES = [
    'rgb(245, 158, 11)',  // Amber (Pending)
    'rgb(59, 130, 246)',  // Blue (Tarjeta)
    'rgb(16, 185, 129)',  // Emerald (Transferencia)
    'rgb(168, 85, 247)',  // Violet (Otros)
];


// --- COMPONENTE PRINCIPAL ---
interface ReservasChartProps {
    subcourtId: string; // ¡Esta es la clave!
}
const RecaudosPorPagoChart: React.FC <ReservasChartProps>  = ({ subcourtId }) => {
    // Definimos el estado usando la interfaz corregida.
    const [recaudosData, setRecaudosData] = useState<DetailedRevenue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Efecto para llamar a la API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getRevenueByPaymentMethod(subcourtId); 
                // Filtramos elementos nulos y aseguramos que el array está limpio
                const cleanedData = Array.isArray(data) ? data.filter(d => d != null) : [];
                setRecaudosData(cleanedData as DetailedRevenue[]);
            } catch (err) {
                console.error("Error al obtener recaudo:", err);
                setError("Ocurrió un error al cargar los datos de recaudo.");
                setRecaudosData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subcourtId]); 

    // 2. Lógica para preparar los datos, **parsear strings a números** y filtrar el 'Total General'.
    const { chartData, totalRecaudo, options } = useMemo(() => {
        
        // CORRECCIÓN CLAVE: Usamos 'payment_method' y verificamos la existencia de la propiedad.
        const filteredData = recaudosData.filter(d => 
            d && d.payment_method && d.payment_method.toLowerCase() !== 'total general'
        );
        
        // CALCULAR el total sumando los valores convertidos a Number.
        const total = filteredData.reduce((sum, d) => sum + Number(d.recaudo_total), 0);

        // Opciones del gráfico
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%', 
            plugins: {
                legend: { 
                    position: 'bottom' as const, 
                    labels: { 
                        usePointStyle: true, 
                        padding: 20,
                        font: { size: 12 }
                    } 
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
                            // Formato de moneda (asumiendo CLP por el formato anterior)
                            const formattedValue = currentValue.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
                            return `${context.label}: ${formattedValue} (${percentage}%)`;
                        }
                    }
                }
            }
        };
        
        // Datos para Chart.js - Convertimos recaudo_total a Number aquí también
        const dataForChart = {
            labels: filteredData.map(d => d.payment_method),
            datasets: [
                {
                    label: 'Recaudo Total',
                    data: filteredData.map(d => Number(d.recaudo_total)), // Conversión
                    backgroundColor: PALETA_COLORES.slice(0, filteredData.length).map(c => c.replace('rgb', 'rgba').replace(')', ', 0.8)')),
                    borderColor: PALETA_COLORES.slice(0, filteredData.length),
                    borderWidth: 2,
                },
            ],
        };

        return { chartData: dataForChart, totalRecaudo: total, options: chartOptions };
    }, [recaudosData]);

    // 3. Renderizado Condicional

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
    
    // Verificamos si hay elementos válidos para el gráfico
    const hasDataForChart = recaudosData.some(d => d && d.payment_method && d.payment_method.toLowerCase() !== 'total general');

    if (!hasDataForChart) {
        return (
            <BaseCard>
                <div className="p-4 bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-lg text-center">
                    <p className="font-bold mb-1">Sin Desglose de Recaudo</p>
                    <p className="text-sm">No se encontraron transacciones detalladas para mostrar.</p>
                </div>
            </BaseCard>
        );
    }

    // 4. Renderizado del Gráfico
    return (
        <BaseCard>
            <div className="w-full max-w-md h-full max-h-[400px] relative">
                {/* Contenedor del Gráfico */}
                <Doughnut options={options as any} data={chartData} />

                {/* Texto Centrado para el Total General */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-sm text-gray-500 mb-1">Total General</p>
                    <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                        {/* Muestra el total calculado */}
                        {totalRecaudo.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })}
                    </p>
                </div>
            </div>
        </BaseCard>
    );
};

export default RecaudosPorPagoChart;
