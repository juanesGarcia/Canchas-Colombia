import React, { useState, useEffect} from 'react';
import { Users } from 'lucide-react';

// Importamos la función y la interfaz del archivo de la API
import { getFrequentClients } from '../../api/auth';


interface FrequentClient {
    user_id: string;
    user_name: string;
    total_reservas: number;
}
// --- COMPONENTE ---
interface ReservasChartProps {
    subcourtId: string; 
    year?: string;
    month?: string;
}

const ClientesFrecuentesTable: React.FC<ReservasChartProps>= ({ subcourtId, year, month }) => {
    const [clientes, setClientes] = useState<FrequentClient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getFrequentClients(subcourtId, { year, month });
                const top5Clientes = data
                    .sort((a, b) => b.total_reservas - a.total_reservas)
                    .slice(0, 5);
                setClientes(top5Clientes);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar los datos.";
                console.error("Fallo al cargar clientes frecuentes:", err);
                setError(`No se pudieron cargar los clientes frecuentes: ${errorMessage}`);
                setClientes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subcourtId, year, month]);

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-lg h-full flex items-center justify-center min-h-[250px]">
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500">Cargando clientes frecuentes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg h-full flex items-center justify-center min-h-[250px]">
                <p>Error: {error}</p>
            </div>
        );
    }
    
    if (clientes.length === 0) {
        return (
            <div className="p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl shadow-lg h-full flex items-center justify-center min-h-[250px]">
                <p>No se encontraron clientes frecuentes para esta fecha.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Clientes Frecuentes (Top {clientes.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Reservas</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clientes.map((cliente, index) => (
                            <tr key={cliente.user_id} className={index % 2 === 0 ? 'bg-white hover:bg-indigo-50' : 'bg-gray-50 hover:bg-indigo-50 transition duration-150'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold text-white bg-indigo-500">{index + 1}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cliente.user_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.user_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-indigo-600">{cliente.total_reservas}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientesFrecuentesTable;