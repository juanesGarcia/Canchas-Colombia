import React, { useState } from 'react';
import Swal from 'sweetalert2';
import ImageSelector from '../images/ImageSelector'; // Importa el componente de carga de imágenes
import {
    MapPin,
    Tag,
    Wrench,
    Smartphone,
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { onRegisterServices } from '../../api/auth';



export const RegisterService: React.FC = () => {
    // Estados del Formulario de Servicio
    const [courtName, setCourtName] = useState(''); // Usado como nombre del servicio
    const [courtAddress, setCourtAddress] = useState(''); // Usado como dirección del servicio
    const [courtCity, setCourtCity] = useState(''); // Usado como ciudad del servicio
    const [courtPhone, setCourtPhone] = useState(''); // Usado como teléfono del servicio
    const [price, setPrice] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [state, setState] = useState(true);

    // Estados de Control
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    // Estado para guardar el ID del servicio creado para ImageSelector
    const [newServiceId, setNewServiceId] = useState<string | null>(null);
    const [courtType, setCourtType] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const authDataString = localStorage.getItem("authData");
        let userId: string | null = null;
        if (authDataString) {
            try {
                const authData = JSON.parse(authDataString);
                // El ID del proveedor logueado
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
            // Nombre del Servicio
            courtName,
            courtAddress,
            courtCity,
            courtPhone,
            price: price === '' ? 0 : Number(price),
            description,
            state,
            court_type: 'services', // Tipo fijo para servicios
            is_court: false, // Indica que no es una cancha
            type: courtType
        };
        try {
            const response = await onRegisterServices(dataToSend, userId);
            console.log(response)
            // Asumiendo que onRegisterServices devuelve un objeto con la propiedad 'serviceId'
            if (response && response.success === true && response.user) {
                setNewServiceId(response.promotionId); // Guardamos el ID del servicio
                setIsRegistered(true); // Marcamos como registrado para mostrar el ImageSelector

                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Ahora puedes subir imágenes de tu servicio.',
                    timer: 2500,
                    timerProgressBar: true,
                });
            } else {
                throw new Error('Respuesta de API incompleta o fallida.');
            }
        } catch (err: any) {
            console.error('Registration failed:', err);
            let errorMessage = 'Hubo un problema al crear el servicio. Por favor, intenta de nuevo.';

            if (err.response && err.response.data && err.response.data.errors) {
                const serverErrors = err.response.data.errors;
                errorMessage = serverErrors.map((e: any) => e.msg).join(' - ');
            } else if (err.message) {
                errorMessage = err.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
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
                            <span className="text-white font-bold text-2xl">S</span>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                        {isRegistered ? 'Subir Imágenes del Servicio' : 'Registrar Nuevo Servicio'}
                    </h2>
                    {!isRegistered && (
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            Completa la información para registrar tu servicio
                        </p>
                    )}
                </div>

                {/* Contenido principal: Formulario o ImageSelector */}
                {!isRegistered ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            {/* Nombre del Servicio */}
                            <div>
                                <label htmlFor="courtName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre del Servicio
                                </label>
                                <div className="relative">
                                    <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="courtName"
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Ej: Alquiler de Implementos"
                                        value={courtName}
                                        onChange={(e) => setCourtName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Dirección */}
                            <div>
                                <label htmlFor="courtAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Dirección
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="courtAddress"
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Dirección completa del servicio"
                                        value={courtAddress}
                                        onChange={(e) => setCourtAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Ciudad */}
                            <div>
                                <label htmlFor="courtCity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ciudad
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="courtCity"
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Ciudad"
                                        value={courtCity}
                                        onChange={(e) => setCourtCity(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label htmlFor="courtPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Teléfono de Contacto
                                </label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="courtPhone"
                                        type="tel"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="+123456789"
                                        value={courtPhone}
                                        onChange={(e) => setCourtPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Precio */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Precio del Servicio
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="price"
                                        type="number"
                                        required
                                        min={0}
                                        step={0.01}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Precio en moneda local"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Descripción del Servicio
                                </label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Detalles sobre lo que ofreces..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Estado (Activo/Inactivo) */}
                            <div className="flex items-center space-x-3 mb-2">
                                <input
                                    id="state"
                                    type="checkbox"
                                    checked={state}
                                    onChange={(e) => setState(e.target.checked)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="state" className="text-sm text-gray-700 dark:text-gray-300">
                                    Activar el servicio
                                </label>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="courtType"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Tipo de cancha
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    id="courtType"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                                    value={courtType}
                                    onChange={(e) =>
                                        setCourtType(
                                            e.target.value as
                                            | 'equipacion'
                                            | 'entrenamiento'
                                            | 'iluminacion'
                                            | 'camerinos'
                                            | 'arbitraje'
                                            | ''
                                        )
                                    }
                                >
                                    <option value="">Selecciona un tipo</option>
                                    <option value="equipacion">Equipación</option>
                                    <option value="entrenamiento">Entrenamiento</option>
                                    <option value="iluminacion">Iluminación</option>
                                    <option value="camerinos">Camerinos</option>
                                    <option value="arbitraje">Arbitraje</option>
                                </select>
                            </div>
                        </div>



                        <div>
                            <Button
                                type="submit"
                                className="w-full py-3 mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                                disabled={loading}
                            >
                                {loading ? 'Registrando Servicio...' : 'Registrar Servicio'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    // Muestra ImageSelector si el servicio está registrado
                    newServiceId && (
                        <div className="mt-12">

                            {/* Pasamos el ID del servicio como userId. Asumo que ImageSelector maneja esto. */}

                            <ImageSelector userId={newServiceId} type="service" />

                            <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
                                **Nota:** El ID de referencia para las imágenes es: `{newServiceId}`
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};