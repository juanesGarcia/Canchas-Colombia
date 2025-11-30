import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    DollarSign,
    Calendar,
    PenTool
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import Swal from 'sweetalert2';
import {
    getSubCourtPrice,
    updateSubCourt // ✅ IMPORT THE NEW API FUNCTION
} from '../../api/auth';
import { SubCourtPrice } from "../../types/types";

export const CourtPriceForm: React.FC = () => {
    const { subcourtId } = useParams<{ subcourtId: string }>();
    const navigate = useNavigate();

    const [courtData, setCourtData] = useState<SubCourtPrice | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!subcourtId) {
            setError('ID de subcancha no encontrado.');
            return;
        }

        const loadData = async () => {
            setLoading(true);
            setError('');
            try {
                const data: SubCourtPrice[] = await getSubCourtPrice(subcourtId);
                
                if (data.length > 0) {
                    setCourtData(data[0]);
                } else {
                    setCourtData(null);
                    setError('No se encontraron datos para esta cancha.');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al cargar los datos.';
                setError('Error al cargar la información: ' + errorMessage);
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
        if (courtData) {
            setCourtData({
                ...courtData,
                price: {
                    ...courtData.price,
                    [day]: Number(value)
                }
            });
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (courtData) {
            setCourtData({ ...courtData, name: e.target.value });
        }
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (courtData) {
            setCourtData({ ...courtData, state: e.target.value === 'true' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!subcourtId || !courtData) {
            setError('Datos de la subcancha no disponibles.');
            setLoading(false);
            return;
        }

        const dataToSend = {
            name: courtData.name,
            price: courtData.price,
            state: courtData.state
        };

        try {
            // ✅ CALL THE API TO UPDATE THE DATA
            await updateSubCourt(subcourtId, dataToSend);
            
            Swal.fire({
                icon: 'success',
                title: '¡Actualización Exitosa!',
                text: 'Los datos de la cancha se han actualizado correctamente.',
                showConfirmButton: false,
                timer: 2000
            });
            
            // Redirect or go back after a successful update
            navigate(-1);

        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al actualizar los datos.';
            setError('Error al actualizar la información: ' + errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error de Actualización',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const dayLabels: { [key: string]: string } = {
        Friday: 'Viernes',
        Monday: 'Lunes',
        Saturday: 'Sábado',
        Sunday: 'Domingo',
        Thursday: 'Jueves',
        Wednesday: 'Miércoles',
        Tuesday: 'Martes',
    };

    if (loading && !courtData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500 dark:text-gray-400">Cargando datos de la cancha...</p>
            </div>
        );
    }
    
    if (!courtData) {
        return null;
    }

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
                        Editando la subcancha: **{courtData.name}**
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
                                    value={courtData.name}
                                    onChange={handleNameChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(courtData.price).map(([day, priceValue]) => (
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

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Estado de la Cancha
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    id="state"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={courtData.state.toString()}
                                    onChange={handleStateChange}
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