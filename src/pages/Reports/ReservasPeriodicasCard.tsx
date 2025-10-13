import React from 'react';
import { Calendar, TrendingUp, DollarSign } from 'lucide-react';

// --- TIPOS Y MOCK DATA (Consulta 4: Total de Reservas Semanal, Mensual, Anual) ---

interface PeriodicMetric {
    periodo: 'Semanal' | 'Mensual' | 'Anual';
    total_reservas: number;
    tendencia_vs_anterior: string; // Ejemplo: '+5%'
    color: string;
}

const mockPeriodicData: PeriodicMetric[] = [
    { 
        periodo: 'Semanal', 
        total_reservas: 1090, 
        tendencia_vs_anterior: '+8.2%', 
        color: 'text-indigo-600' 
    },
    { 
        periodo: 'Mensual', 
        total_reservas: 4150, 
        tendencia_vs_anterior: '+12.5%', 
        color: 'text-green-600' 
    },
    { 
        periodo: 'Anual', 
        total_reservas: 50200, 
        tendencia_vs_anterior: '+4.1%', 
        color: 'text-purple-600' 
    },
];

// --- COMPONENTE ---

const ReservasPeriodicasCard: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                Resumen de Reservas por Período (Consulta 4)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockPeriodicData.map((metric, index) => (
                    <div 
                        key={index} 
                        className="p-5 border-l-4 border-indigo-500 bg-gray-50 rounded-lg shadow-sm"
                    >
                        <p className="text-sm font-medium text-gray-500 uppercase">{metric.periodo}</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-1">
                            {metric.total_reservas.toLocaleString()}
                        </p>
                        <div className="flex items-center mt-2">
                            <TrendingUp className={`w-4 h-4 mr-1 ${metric.color}`} />
                            <span className={`text-sm font-semibold ${metric.color}`}>
                                {metric.tendencia_vs_anterior}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">vs. período anterior</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReservasPeriodicasCard;
