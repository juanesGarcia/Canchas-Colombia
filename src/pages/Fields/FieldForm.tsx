import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Phone, AlignLeft, Tally2 } from 'lucide-react'; // Importamos el ícono de teléfono y otros
import { Button } from '../../components/UI/Button';
import Swal from 'sweetalert2';
import {
    onUpdateCourt
} from '../../api/auth';
import { useAuth } from "../../contexts/AuthContext";

export const FieldForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Captura el ID de la URL
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '', // ¡Nuevo campo para el número de teléfono!
        court_type: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fieldTypes = [
        { value: "", label: "Seleccione un tipo de cancha" },
        { value: "futbol", label: "Fútbol" },
        { value: "basketball", label: "Básquet" },
        { value: "tennis", label: "Tenis" },
        { value: "volleyball", label: "Voleibol" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!user || !user.token) {
            setError('Faltan datos de autenticación. Por favor, vuelve a iniciar sesión.');
            setLoading(false);
            return;
        }

        // Validación actualizada para incluir el teléfono
        if (!formData.name || !formData.description || !formData.phone || !formData.court_type) {
            setError('Todos los campos son obligatorios.');
            setLoading(false);
            return;
        }

        const fieldId = id;
        if (!fieldId) {
            setError('ID de cancha no proporcionado.');
            setLoading(false);
            return;
        }

        const dataToSend = {
            id: fieldId,
            fieldData: {
                name: formData.name,
                description: formData.description,
                phone: formData.phone, // Incluimos el teléfono
                court_type: formData.court_type,
            },
            token: user.token
        };

         try {
                    await onUpdateCourt(dataToSend);
                    Swal.fire({
                        icon: 'success',
                        title: '¡Actualización Exitosa!',
                        text: 'El perfil se ha actualizado correctamente.',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    navigate('/dashboard'); 
                } catch (err: any) {
                    const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al actualizar el perfil.';
                    setError('Error: ' + errorMessage);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Actualización',
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
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                        Actualizar Cancha
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {error}
                            </div>
                        )}
                        {/* Campo de Nombre */}
                        <div>
                            <label htmlFor="name" className="sr-only">Nombre de la Cancha</label>
                            <div className="relative">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nombre de la cancha"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Campo de Descripción */}
                        <div>
                            <label htmlFor="description" className="sr-only">Descripción</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Descripción de la cancha"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        {/* ¡Nuevo! Campo de Teléfono */}
                        <div>
                            <label htmlFor="phone" className="sr-only">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Teléfono de contacto"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Campo de Tipo de Cancha (Select) */}
                        <div>
                            <label htmlFor="court_type" className="sr-only">Tipo de Cancha</label>
                            <div className="relative">
                                <Tally2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    id="court_type"
                                    name="court_type"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                                    value={formData.court_type}
                                    onChange={handleChange}
                                >
                                    {fieldTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
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