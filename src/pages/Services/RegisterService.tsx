import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageSelector from '../images/ImageSelector';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Smartphone,
    MapPin,
    Tag,
    Info,
    CheckCircle,
    CircleOff,
    Wrench, // Icono para representar un servicio
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { useAuth } from '../../contexts/AuthContext';

export const RegisterService: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [courtName, setCourtName] = useState('');
    const [courtAddress, setCourtAddress] = useState('');
    const [courtCity, setCourtCity] = useState('');
    const [courtPhone, setCourtPhone] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [state, setState] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        const dataToSend = {
            email,
            password,
            name,
            role: "admin",
            phone,
            courtName,
            courtAddress,
            courtCity,
            courtPhone,
            price: Number(price),
            description,
            state,
            is_court: false, // ¡Campo clave para diferenciarlo de una cancha!
        };

        try {
            const success = await register(dataToSend);

            if (success) {
                navigate('/login');
            }
        } catch (err) {
            setError('Error al crear el servicio. Intenta de nuevo.' + err);
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
                        Registrar Servicio
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* Campos de usuario */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre del responsable
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Tu nombre completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Número de teléfono
                            </label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: 3101234567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Confirma tu contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Campos del Servicio */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Información del Servicio</h3>
                        </div>

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
                                    placeholder="Ej: Fisioterapia Deportiva"
                                    value={courtName}
                                    onChange={(e) => setCourtName(e.target.value)}
                                />
                            </div>
                        </div>

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
                                    placeholder="Ej: Avenida Siempre Viva 742"
                                    value={courtAddress}
                                    onChange={(e) => setCourtAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="courtCity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ciudad
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="courtCity"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: Springfield"
                                    value={courtCity}
                                    onChange={(e) => setCourtCity(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="courtPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Teléfono del Servicio
                            </label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="courtPhone"
                                    type="tel"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: 6015551234"
                                    value={courtPhone}
                                    onChange={(e) => setCourtPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Precio del servicio
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
                                    placeholder="Una breve descripción del servicio..."
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
                                Servicio activo
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
                            Registrar Servicio
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};