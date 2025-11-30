import React, { useState, useEffect } from 'react';
import { Clock, Flame, Snowflake } from 'lucide-react';

// Importamos la función y la interfaz.
// ASUMIMOS que la interfaz exportada ahora tiene las claves 'tipo' y 'total_reservas'.
import { getPeakOffPeakHours } from '../../api/auth';

interface PeakOffPeakHour {
    tipo: 'hot' | 'cold'; // 'hot' (pico) o 'cold' (valle)
    hora: string; // Hora en formato HH24 (ej. "18")
    total_reservas: number;
}

interface ReservasChartProps {
    subcourtId: string;
    year?: string;
    month?: string;
}


const HotColdHoursCard: React.FC<ReservasChartProps> = ({ subcourtId, year, month }) => {
    const [peakHoursData, setPeakHoursData] = useState<PeakOffPeakHour[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getPeakOffPeakHours(subcourtId, { year, month });
                setPeakHoursData(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar los datos.";
                console.error("Fallo al cargar horarios pico/valle:", err);
                setError(`No se pudieron cargar los horarios pico y valle: ${errorMessage}`);
                setPeakHoursData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subcourtId, year, month]);

    const hotHour = peakHoursData.find(h => h.tipo === 'hot');
    const coldHour = peakHoursData.find(h => h.tipo === 'cold');

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-lg h-full flex items-center justify-center">
                <p className="text-gray-500">Buscando horarios pico y valle...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg h-full flex items-center justify-center">
                <p>Error: {error}</p>
            </div>
        );
    }

    if (!hotHour && !coldHour) {
        return (
            <div className="p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl shadow-lg h-full flex items-center justify-center">
                <p>No se encontraron datos de horarios pico/valle para esta subcancha en la fecha seleccionada.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg h-full flex flex-col justify-between">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                Horarios Pico y Valle (Consulta 3)
            </h2>
            
            <div className="space-y-4">
                {hotHour && (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-center">
                        <div className="p-2 rounded-full bg-red-500 text-white mr-4">
                            <Flame className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-red-700">Horario más demandado (Pico)</p>
                            <p className="text-xl font-bold text-gray-900">{hotHour.hora}</p>
                            <p className="text-xs text-gray-600">{hotHour.total_reservas} reservas en promedio.</p>
                        </div>
                    </div>
                )}

                {coldHour && (
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg flex items-center">
                        <div className="p-2 rounded-full bg-blue-500 text-white mr-4">
                            <Snowflake className="w-5 h-5" /> 
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-700">Horario de menor demanda (Valle)</p>
                            <p className="text-xl font-bold text-gray-900">{coldHour.hora}</p>
                            <p className="text-xs text-gray-600">{coldHour.total_reservas} reservas en promedio.</p>
                        </div>
                    </div>
                )}
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
                Esta métrica es vital para ajustar la planificación de personal y precios.
            </p>
        </div>
    );
};

export default HotColdHoursCard;