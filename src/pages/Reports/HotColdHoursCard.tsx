import React from 'react';
import { Clock, Flame, Snowflake } from 'lucide-react'; // ¡CORREGIDO: Cambiado 'Snow' por 'Snowflake'!

// --- TIPOS Y MOCK DATA (Consulta 3: Horarios Fríos y Calientes) ---

interface PeakHour {
    type: 'hot' | 'cold';
    hora: string;
    reservas: number;
}

const mockHorarios: PeakHour[] = [
    { type: 'hot', hora: '17:00 - 18:00', reservas: 180 }, // Hora caliente (Pico)
    { type: 'cold', hora: '08:00 - 09:00', reservas: 15 }, // Hora fría (Valle)
];

// --- COMPONENTE ---

const HotColdHoursCard: React.FC = () => {
    const hotHour = mockHorarios.find(h => h.type === 'hot');
    const coldHour = mockHorarios.find(h => h.type === 'cold');

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg h-full flex flex-col justify-between">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                Horarios Pico y Valle (Consulta 3)
            </h2>
            
            <div className="space-y-4">
                {/* Horario Caliente (Pico) */}
                {hotHour && (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-center">
                        <div className="p-2 rounded-full bg-red-500 text-white mr-4">
                            <Flame className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-red-700">Horario más demandado (Pico)</p>
                            <p className="text-xl font-bold text-gray-900">{hotHour.hora}</p>
                            <p className="text-xs text-gray-600">{hotHour.reservas} reservas en promedio.</p>
                        </div>
                    </div>
                )}

                {/* Horario Frío (Valle) */}
                {coldHour && (
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg flex items-center">
                        <div className="p-2 rounded-full bg-blue-500 text-white mr-4">
                            {/* ¡CORREGIDO: Usamos Snowflake en lugar de Snow! */}
                            <Snowflake className="w-5 h-5" /> 
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-700">Horario de menor demanda (Valle)</p>
                            <p className="text-xl font-bold text-gray-900">{coldHour.hora}</p>
                            <p className="text-xs text-gray-600">{coldHour.reservas} reservas en promedio.</p>
                        </div>
                    </div>
                )}
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
                Esta métrica es vital para ajustar la planificación de personal.
            </p>
        </div>
    );
};

export default HotColdHoursCard;
