import React, { useState, useEffect, useMemo } from 'react';
// Importamos los componentes de react-chartjs-2
import { Bar, Doughnut } from 'react-chartjs-2';
// Importamos los elementos necesarios de Chart.js para su correcto funcionamiento
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
// Importamos íconos de lucide-react para el diseño
import { CalendarDays, DollarSign, Clock, Users } from 'lucide-react';

// Registramos los componentes que vamos a usar en Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- 1. DEFINICIÓN DE TIPOS DE DATOS (Interfaces TS) ---

// Mismos tipos que reflejan la salida de las consultas SQL
interface ReservasPorDia {
  dia_semana: string;
  orden: number;
  total_reservas: number;
}

interface RecaudosPorPago {
  medio_pago: string;
  recaudo_total: number;
}

interface KpiData {
  titulo: string;
  valor: string | number;
  icon: React.ElementType;
  color: string;
}

// --- 2. DATOS SIMULADOS (MOCK DATA) ---

const mockReservasDia: ReservasPorDia[] = [
  { dia_semana: 'Lunes', orden: 1, total_reservas: 85 },
  { dia_semana: 'Martes', orden: 2, total_reservas: 120 },
  { dia_semana: 'Miércoles', orden: 3, total_reservas: 95 },
  { dia_semana: 'Jueves', orden: 4, total_reservas: 150 },
  { dia_semana: 'Viernes', orden: 5, total_reservas: 210 },
  { dia_semana: 'Sábado', orden: 6, total_reservas: 250 },
  { dia_semana: 'Domingo', orden: 7, total_reservas: 180 },
].sort((a, b) => a.orden - b.orden);

const mockRecaudos: RecaudosPorPago[] = [
  { medio_pago: 'Transferencia / Digital', recaudo_total: 125000 },
  { medio_pago: 'Efectivo / Otros', recaudo_total: 75000 },
];

// Cálculo de KPIs basado en datos simulados
const kpis: KpiData[] = [
    { 
        titulo: 'Total Reservas (Semanal)', 
        valor: mockReservasDia.reduce((sum, d) => sum + d.total_reservas, 0), 
        icon: CalendarDays, 
        color: 'bg-indigo-500' 
    },
    { 
        titulo: 'Recaudo Promedio/Reserva', 
        valor: `$${(mockRecaudos.reduce((sum, d) => sum + d.recaudo_total, 0) / mockReservasDia.reduce((sum, d) => sum + d.total_reservas, 0)).toFixed(2)}`, 
        icon: DollarSign, 
        color: 'bg-green-500' 
    },
    { 
        titulo: 'Total Recaudado', 
        valor: `$${mockRecaudos.reduce((sum, d) => sum + d.recaudo_total, 0).toLocaleString('es-CL')}`, 
        icon: DollarSign, 
        color: 'bg-red-500' 
    },
    { 
        titulo: 'Top Cliente Frecuente', 
        valor: 'Javier Pérez (18 reservas)', 
        icon: Users, 
        color: 'bg-yellow-500' 
    },
];

// --- 3. COMPONENTE DE GRÁFICO DE BARRAS (Reservas por Día) ---

const BarChartReservas: React.FC = () => {
    // Prepara los datos para Chart.js
    const data = useMemo(() => ({
        labels: mockReservasDia.map(d => d.dia_semana),
        datasets: [
            {
                label: 'Total de Reservas',
                data: mockReservasDia.map(d => d.total_reservas),
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // Tailwind blue-500 con transparencia
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    }), []);

    // Opciones del gráfico de barras
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Reservas por Día de la Semana',
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.parsed.y.toLocaleString() + ' reservas';
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cantidad de Reservas'
                }
            }
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg h-full">
            <div className="w-full h-[300px]">
                <Bar options={options as any} data={data} />
            </div>
        </div>
    );
};

// --- 4. COMPONENTE DE GRÁFICO DE ROSQUILLA (Recaudos por Pago) ---

const DoughnutChartRecaudos: React.FC = () => {
    // Prepara los datos para Chart.js
    const data = useMemo(() => ({
        labels: mockRecaudos.map(d => d.medio_pago),
        datasets: [
            {
                label: 'Recaudo Total',
                data: mockRecaudos.map(d => d.recaudo_total),
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)', // Transferencia: Tailwind emerald-500
                    'rgba(245, 158, 11, 0.8)', // Efectivo: Tailwind amber-500
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
        cutout: '70%', // Esto crea el efecto de rosquilla (Doughnut)
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            title: {
                display: true,
                text: 'Distribución de Recaudos por Medio de Pago',
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const currentValue = context.raw;
                        const percentage = ((currentValue / total) * 100).toFixed(1);
                        return `${context.label}: $${currentValue.toLocaleString('es-CL')} (${percentage}%)`;
                    }
                }
            }
        }
    };

    const totalRecaudado = mockRecaudos.reduce((sum, d) => sum + d.recaudo_total, 0);

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg h-full flex flex-col items-center">
             <div className="mb-4 p-3 bg-indigo-50 rounded-lg text-indigo-700 w-full text-center">
                <DollarSign className="inline-block w-5 h-5 mr-2" />
                <span className="font-bold">Total Recaudado:</span> ${totalRecaudado.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
            </div>
            <div className="relative w-full max-w-sm h-full max-h-[300px]">
                <Doughnut options={options as any} data={data} />
            </div>
        </div>
    );
};

// --- 5. COMPONENTE PRINCIPAL RENOMBRADO (PruebaChart) ---

const PruebaChart: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula la carga de datos (Aquí iría la llamada a tu API real)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-indigo-600 font-medium">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Recaudos y Reservas</h1>
        <p className="text-gray-600">Componente **PruebaChart**: Visualización de métricas financieras y operativas con Chart.js.</p>
      </header>

      {/* Tarjetas KPI */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div 
            key={index} 
            className="p-5 bg-white rounded-xl shadow-md transition duration-300 hover:shadow-lg"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${kpi.color} text-white`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{kpi.titulo}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.valor}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <BarChartReservas />
        </div>
        
        <div>
            <DoughnutChartRecaudos />
        </div>
      </section>
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Los datos reflejan la distribución de recaudos entre Transferencia/Digital y Efectivo/Otros.</p>
      </footer>
    </div>
  );
};

export default PruebaChart;
