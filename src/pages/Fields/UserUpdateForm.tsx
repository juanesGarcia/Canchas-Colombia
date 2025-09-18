import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { Button } from '../../components/UI/Button';
import Swal from 'sweetalert2';
import {
    onUpdateUser // Usamos el nombre de tu función de API
} from '../../api/auth';

import { useAuth } from "../../contexts/AuthContext";

export const UserUpdateForm: React.FC = () => {
    const navigate = useNavigate();
  const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

              if (!user || !user.id || !user.token) {
            setError('Faltan datos de usuario. Por favor, vuelve a iniciar sesión.');
            setLoading(false);
            return;
        }

        if (!formData.name || !formData.password) {
            setError('Todos los campos son obligatorios.');
            setLoading(false);
            return;
        }

        // Obtener el token del almacenamiento local o de donde lo tengas guardado


        // Creamos el objeto con el formato que la función onUpdateUser espera
       const dataToSend = {
    id: user.id,
    userData: {
        name: formData.name,
        password: formData.password
    },
    token: user.token
};

        try {
            await onUpdateUser(dataToSend);
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
                        Actualizar Perfil de Usuario
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="name" className="sr-only">Nombre</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nombre de usuario"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nueva contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
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