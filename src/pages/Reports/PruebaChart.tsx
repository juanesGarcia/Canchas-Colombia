import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import ClientesFrecuentesTable from './ClientesFrecuentesTable'; 
import ReservasPorDiaChart from './ReservasPorDiaChart';
import RecaudosPorPagoChart from './RecaudosPorPagoChart';
import ReservasPorHoraChart from './ReservasPorHoraChart';
import ReservasPeriodicasCard from './ReservasPeriodicasCard';
import HotColdHoursCard from './HotColdHoursCard';

interface PlaceholderProps {
    title: string;
    icon: React.ElementType;
    color: string;
    height?: string;
    subcourtId: string; 
}

const PlaceholderCard: React.FC<PlaceholderProps> = ({ title, icon: Icon, color, height = 'h-72' }) => (
    <div className={`p-6 bg-white rounded-xl shadow-lg border-t-4 border-${color} ${height} flex flex-col justify-center items-center text-center`}>
        <div className={`p-3 rounded-full bg-${color} text-white mb-3 shadow-md`}>
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">Aquí se renderizará tu componente de reporte.</p>
    </div>
);

const PruebaChart: React.FC = () => {
    const [loading, setLoading] = useState(true);
    
    const { subcourtId } = useParams<{ subcourtId: string }>();
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (!subcourtId) {
            console.error("ERROR: subcourtId no se encontró en los parámetros de la URL.");
        }

        const loadAllData = async () => {
            setTimeout(() => {
                setLoading(false);
            }, 1000); 
        };

        loadAllData();
    }, [subcourtId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 p-8">
                <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-xl shadow-2xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="text-xl text-indigo-700 font-semibold">Cargando Dashboard de Reportes...</p>
                    <p className="text-sm text-gray-500">Unificando todas tus estadísticas en un solo lugar.</p>
                </div>
            </div>
        );
    }
    
    const currentSubcourtId = subcourtId || "ID no disponible";

    return (
        <div className="min-h-screen p-4 sm:p-8 font-sans bg-gray-100 dark:bg-gray-900">
            
            <header className="mb-8">
                
                <button 
                    onClick={handleGoBack}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 mb-4 p-2 rounded-full hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Volver atrás"
                >
                    <ArrowLeft className="w-6 h-6 mr-1" /> 
                    <span className="text-sm font-medium hidden sm:inline">Volver</span>
                </button>

                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white pb-2">
                    📊 Centro de Reportes y Analíticas
                </h1>
                <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                    Estadísticas para Subcancha ID: <span className="font-mono bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded text-sm">{currentSubcourtId}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Vista consolidada de todos tus indicadores clave de gestión.</p>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                <div className="lg:col-span-2">
                    <ReservasPorDiaChart subcourtId={currentSubcourtId} />
                </div>
                
                <div>
                    <RecaudosPorPagoChart subcourtId={currentSubcourtId} />
                </div>
                
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                
                <div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl h-full">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-blue-600" /> Clientes Más Frecuentes
                        </h2>
                        <ClientesFrecuentesTable subcourtId={currentSubcourtId} />
                    </div>
                </div>
                
                <div>
                    <ReservasPorHoraChart subcourtId={currentSubcourtId} />
                </div>

            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <ReservasPeriodicasCard subcourtId={currentSubcourtId} />

                <HotColdHoursCard subcourtId={currentSubcourtId} />

            </section>
            
        </div>
    );
};

export default PruebaChart;
