import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    DollarSign,
    Calendar,
    PenTool,
    CreditCard
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import Swal from 'sweetalert2';
import {
    fetchCourtPriceData,
    updateCourtPrices
} from '../../api/auth'; // Asegúrate de que estas funciones existan

interface CourtPriceData {
    name: string;
    prices: {
        monday: number;
        tuesday: number;
        wednesday: number;
        thursday: number;
        friday: number;
        saturday: number;
        sunday: number;
    };
    state: boolean;
}

export const CourtPriceForm: React.FC = () => {
    const { subcourtId } = useParams<{ subcourtId: string }>();
    const navigate = useNavigate();

    const [courtName, setCourtName] = useState('');
    const [prices, setPrices] = useState < Record < string, number >> ({
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
    });
    const [state, setState] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        if (!subcourtId) {
            setError('ID de subcancha no encontrado. No se puede cargar la información.');
            return;
        }

        const loadData = async () => {
            setLoading(true);
            setError('');
            try {
                // Suponiendo que `fetchCourtPriceData` es una función en tu API que trae la info.
                const data: CourtPriceData = await fetchCourtPriceData(subcourtId);
                setCourtName(data.name);
                setPrices(data.prices);
                setState(data.state);
                setDataFetched(true);
            } catch (err: any) {
                const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al cargar los datos.';
                setError('Error al cargar la información de la cancha. ' + errorMessage);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de carga',
                    text: errorMessage,
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [subcourtId]);

    const handlePriceChange = (day: string, value: string) => {
        setPrices(prevPrices => ({
            ...prevPrices,
            [day]: Number(value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!subcourtId) {
            setError('ID de subcancha no encontrado. No se puede actualizar el precio.');
            setLoading(false);
            return;
        }

        const dataToSend = {
            name: courtName,
            prices,
            state
        };

        try {
            // `updateCourtPrices` sería tu función API para actualizar los datos.
            const success = await updateCourtPrices(dataToSend, subcourtId);

            if (success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualización Exitosa!',
                    text: 'Los precios y el estado de la subcancha han sido actualizados.',
                    showConfirmButton: false,
                    timer: 2000
                });
                navigate('/');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al actualizar la información.';
            setError('Error al actualizar los precios. ' + errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error de Actualización',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const dayLabels: {
        [key: string]: string
    } = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <DollarSign className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                        Actualizar Precios y Estado de Cancha
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {dataFetched ? `Editando la subcancha: ${courtName}` : 'Cargando...'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="courtName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre de la Cancha
                            </label>
                            <div className="relative">
                                <PenTool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="courtName"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Nombre de la cancha"
                                    value={courtName}
                                    onChange={(e) => setCourtName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Precios por día */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(prices).map(([day, priceValue]) => (
                                <div key={day}>
                                    <label htmlFor={day} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Precio para {dayLabels[day]}
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id={day}
                                            type="number"
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="Ej: 50000"
                                            value={priceValue}
                                            onChange={(e) => handlePriceChange(day, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Estado de la cancha */}
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Estado de la Cancha
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    id="state"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={state.toString()}
                                    onChange={(e) => setState(e.target.value === 'true')}
                                >
                                    <option value="true">Disponible</option>
                                    <option value="false">No Disponible</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="w-full"
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};