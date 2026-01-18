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
import { onRegisterPromotions } from '../../api/auth'; // Asumo que esta API es correcta
import Swal from 'sweetalert2';

export const RegisterPromotion: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [state, setState] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Nuevo estado para el flujo de registro condicional
    const [newPromotionId, setNewPromotionId] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);

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
                // El ID del usuario creador (proveedor/admin)
                userId = authData.user?.id; 
            } catch (error) {
                console.error("Error al parsear authData del localStorage:", error);
            }
        }

        if (!userId) {
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: 'No se pudo obtener el ID del usuario. Por favor, inicia sesión de nuevo.',
            });
            setLoading(false);
            return;
        }

        const dataToSend = {
            name,
            phone,
            price: price === '' ? 0 : Number(price),
            description,
            state,
            type: "promotion",
            is_public: true
        };

        try {
            // Asumo que onRegisterPromotions devuelve un objeto con un 'promotionId'
            const response = await onRegisterPromotions(dataToSend, userId);

            // Adapto la lógica de respuesta basándome en el componente Register:
            // Debe haber un indicador de éxito y el ID del elemento creado.
           if (response.success === true && response.promotionId) {
        setNewPromotionId(response.promotionId);
        setIsRegistered(true);

        Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Ahora puedes subir imágenes para tu promoción.',
            timer: 2500,
            timerProgressBar: true,
        });
    } else {
        throw new Error('No se pudo obtener el ID de la promoción registrada.');
    }
        } catch (err: any) {
            console.error('Registration failed:', err);
            let errorMessage = 'Hubo un problema al crear tu promoción. Por favor, intenta de nuevo.';

            if (err.response && err.response.data && err.response.data.errors) {
                const serverErrors = err.response.data.errors;
                errorMessage = serverErrors.map((e: any) => e.msg).join(' - ');
            } else if (err.response && err.response.data && err.response.data.error) {
                 errorMessage = err.response.data.error;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: errorMessage,
            });
            setError(errorMessage);
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
                        {isRegistered ? 'Subir imágenes de la Promoción' : 'Registrar Nueva Promoción'}
                    </h2>
                    {!isRegistered && (
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            Completa la información para registrar tu promoción
                        </p>
                    )}
                </div>

                {/* Mostrar formulario solo si NO está registrado */}
                {!isRegistered ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
                                    {error}
                                </div>
                            )}
                            
                            {/* Nombre de la Promoción */}
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

                            {/* Teléfono de contacto */}
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
                                        placeholder="Teléfono para la promoción"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Precio */}
                            <div>
                                <label
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Precio o Monto de Descuento
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="price"
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Monto en moneda local (ej: 100.00)"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Descripción de la Promoción
                                </label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Detalles y condiciones de la promoción"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Estado (Activa/Inactiva) */}
                            <div className="flex items-center space-x-3 mb-2">
                                <input
                                    id="state"
                                    type="checkbox"
                                    checked={state}
                                    onChange={(e) => setState(e.target.checked)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="state" className="text-sm text-gray-700 dark:text-gray-300">
                                    Activar promoción
                                </label>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full py-3 mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                                disabled={loading}
                            >
                                {loading ? 'Registrando...' : 'Registrar Promoción'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    // Mostrar ImageSelector cuando la promoción está registrada
                    newPromotionId && (
                        <div className="mt-12">
                 
                            {/* Nota: Necesitas asegurarte de que ImageSelector puede manejar un ID de promoción. 
                            Asumo que 'userId' en ImageSelector es un nombre de prop genérico para un ID. */}
                            <ImageSelector userId={newPromotionId} type="promotion" />
                            
                            <Button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-3 mt-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md"
                            >
                                Finalizar y volver al Dashboard
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};