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
  Building, 
  MapPin, 
  Tag,
  Info,
  CheckCircle,
  CircleOff,
  ClipboardList,
  PlusCircle, // Nuevo icono para agregar
  MinusCircle, // Nuevo icono para eliminar
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [courtName, setCourtName] = useState('');
  const [courtAddress, setCourtAddress] = useState('');
  const [courtCity, setCourtCity] = useState('');
  const [courtPhone, setCourtPhone] = useState('');
  const [courtType, setCourtType] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [isPublic, setIsPublic] = useState(true);
  const [description, setDescription] = useState('');
  const [state, setState] = useState(true);
  
  // Estado para gestionar las subcanchas
  const [subcourts, setSubcourts] = useState([{ subcourtName: '', state: true }]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Función para agregar una nueva subcancha
  const handleAddSubcourt = () => {
    setSubcourts([...subcourts, { subcourtName: '', state: true }]);
  };

  // Función para manejar cambios en una subcancha específica
  const handleSubcourtChange = (index: number, field: string, value: string | boolean) => {
    const newSubcourts = [...subcourts];
    if (field === 'subcourtName') {
      newSubcourts[index].subcourtName = value as string;
    } else if (field === 'state') {
      newSubcourts[index].state = value as boolean;
    }
    setSubcourts(newSubcourts);
  };
  
  // Función para eliminar una subcancha
  const handleRemoveSubcourt = (index: number) => {
    const newSubcourts = subcourts.filter((_, i) => i !== index);
    setSubcourts(newSubcourts);
  };

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
  role: "admin", // O el rol por defecto que vayas a usar, ya que lo excluíste del formulario.
  phone,
  courtName,
  courtAddress,
  courtCity,
  courtPhone,
  court_type: courtType,
  price: Number(price), // Asegura que el precio es un número.
  is_public: isPublic,
  description,
  state,
  subcourts: subcourts.map(subcourt => ({
    subcourtName: subcourt.subcourtName,
    state: subcourt.state,
  })),
};
    try {
      const success = await register(dataToSend);
      
      if (success) {
        navigate('/login');
      }
    } catch (err) {
      setError('Error al crear la cuenta. Intenta de nuevo.'+err);
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
            Crear Cuenta
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
                Nombre completo
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

            {/* Campos de la cancha */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Información de la Cancha</h3>
            </div>

            <div>
              <label htmlFor="courtName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la Cancha
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="courtName"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ej: Teddy Canchas"
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
                Teléfono de la Cancha
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
              <label htmlFor="courtType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Cancha
              </label>
              <div className="relative">
                <ClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="courtType"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ej: Baloncesto"
                  value={courtType}
                  onChange={(e) => setCourtType(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio de alquiler
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="price"
                  type="number"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ej: 50000"
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
                  placeholder="Una breve descripción de la cancha..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="is_public"
                name="is_public"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded-sm"
              />
              <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Cancha pública
              </label>
              {isPublic ? <CheckCircle className="ml-2 w-4 h-4 text-green-500" /> : <CircleOff className="ml-2 w-4 h-4 text-gray-500" />}
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
                Cancha activa
              </label>
              {state ? <CheckCircle className="ml-2 w-4 h-4 text-green-500" /> : <CircleOff className="ml-2 w-4 h-4 text-gray-500" />}
            </div>

            {/* Campos de Subcanchas */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Subcanchas</h3>
                {subcourts.map((subcourt, index) => (
                    <div key={index} className="space-y-4 mb-4 p-4 border rounded-md border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900 dark:text-white">Subcancha {index + 1}</h4>
                            {subcourts.length > 1 && (
                                <button type="button" onClick={() => handleRemoveSubcourt(index)} className="text-red-500 hover:text-red-700">
                                    <MinusCircle className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <div>
                            <label htmlFor={`subcourtName-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre de la Subcancha
                            </label>
                            <input
                                id={`subcourtName-${index}`}
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Ej: Cancha 1"
                                value={subcourt.subcourtName}
                                onChange={(e) => handleSubcourtChange(index, 'subcourtName', e.target.value)}
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                id={`subcourtState-${index}`}
                                type="checkbox"
                                checked={subcourt.state}
                                onChange={(e) => handleSubcourtChange(index, 'state', e.target.checked)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded-sm"
                            />
                            <label htmlFor={`subcourtState-${index}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Subcancha activa
                            </label>
                            {subcourt.state ? <CheckCircle className="ml-2 w-4 h-4 text-green-500" /> : <CircleOff className="ml-2 w-4 h-4 text-gray-500" />}
                        </div>
                    </div>
                ))}
                <Button type="button" variant="ghost" className="w-full flex items-center justify-center space-x-2" onClick={handleAddSubcourt}>
                    <PlusCircle className="w-5 h-5" />
                    <span>Agregar Subcancha</span>
                </Button>
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
              Crear Cuenta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};