import React, { useMemo } from 'react';
import { Users } from 'lucide-react';

// --- TIPOS Y MOCK DATA (Consulta 5) ---

interface ClienteFrecuente {
  nombre_cliente: string;
  documento: string;
  total_reservas: number;
}

const mockClientes: ClienteFrecuente[] = [
    { nombre_cliente: 'Juan Pérez', documento: '1000162871', total_reservas: 18 },
    { nombre_cliente: 'María López', documento: '9876543210', total_reservas: 15 },
    { nombre_cliente: 'Carlos Gómez', documento: '1234567890', total_reservas: 12 },
    { nombre_cliente: 'Ana Torres', documento: '5551112223', total_reservas: 11 },
    { nombre_cliente: 'Pedro Sánchez', documento: '4443332211', total_reservas: 9 },
];

// --- COMPONENTE ---

const ClientesFrecuentesTable: React.FC = () => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Clientes Frecuentes (Top 5 - Consulta 5)</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Posición
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre del Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Documento
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Reservas
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockClientes.map((cliente, index) => (
                            <tr key={cliente.documento} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {cliente.nombre_cliente}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cliente.documento}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-indigo-600">
                                    {cliente.total_reservas}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientesFrecuentesTable;
