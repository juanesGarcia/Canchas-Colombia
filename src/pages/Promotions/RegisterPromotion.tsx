import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageSelector from '../images/ImageSelector';
import {
    MapPin,
    Tag,
    Info,
    CheckCircle,
    CircleOff,
    Gift,
    Smartphone,
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { useAuth } from '../../contexts/AuthContext';
import { onRegisterPromotions } from '../../api/auth';
import Swal from 'sweetalert2';

export const RegisterPromotion: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [state, setState] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const authDataString = localStorage.getItem("authData");
        let userId: string | null = null;
        if (authDataString) {
            try {
                const authData = JSON.parse(authDataString);
                userId = authData.user?.id;
            } catch (error) {
                console.error("Error al parsear authData del localStorage:", error);
            }
        }

        if (!userId) {
            setError('No se pudo obtener el ID del usuario. Por favor, inicia sesión de nuevo.');
            setLoading(false);
            return;
        }

        const dataToSend = {
            name,
            phone,
            price: Number(price),
            description,
            state,
            type: "promotion",
            is_public: true
        };

        console.log(dataToSend);
        console.log(userId);

        try {
            const success = await onRegisterPromotions(dataToSend, userId);

            if (success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro Exitoso!',
                    text: 'La promoción ha sido registrada correctamente.',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    navigate('/dashboard');
                });
            } else {
                setError('No se pudo completar el registro de la promoción.');
                Swal.fire({
                    icon: 'warning',
                    title: 'Registro Incompleto',
                    text: 'No se pudo completar el registro de la promoción. Intenta de nuevo.',
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al crear la promoción.';
            setError('Error al crear la promoción. Intenta de nuevo. ' + errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error de Registro',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">P</span>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                        Registrar Nueva Promoción
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Completa la información para registrar tu promoción
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
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre de la Promoción
                            </label>
                            <div className="relative">
                                <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: Descuento 2x1 en cancha"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Teléfono de contacto
                            </label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: 6015551234"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Precio de la promoción
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="price"
                                    type="number"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: 30000"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descripción
                            </label>
                            <div className="relative">
                                <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <textarea
                                    id="description"
                                    required
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Una breve descripción de la promoción..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="state"
                                name="state"
                                type="checkbox"
                                checked={state}
                                onChange={(e) => setState(e.target.checked)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded-sm"
                            />
                            <label htmlFor="state" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Promoción activa
                            </label>
                            {state ? <CheckCircle className="ml-2 w-4 h-4 text-green-500" /> : <CircleOff className="ml-2 w-4 h-4 text-gray-500" />}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded-sm"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Acepto los{' '}
                                <Link to="/terms" className="font-medium text-green-600 hover:text-green-500">
                                    términos y condiciones
                                </Link>
                            </label>
                        </div>
                    </div>

                    <ImageSelector />

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="w-full"
                        >
                            Registrar Promoción
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};