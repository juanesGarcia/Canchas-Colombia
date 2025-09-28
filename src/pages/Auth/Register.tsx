import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
  PlusCircle,
  MinusCircle,
  UserCheck,
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { useAuth } from '../../contexts/AuthContext';
import { onRegisterProveedor } from '../../api/auth';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [role, setRole] = useState<'admin' | 'proveedor'>('admin');

  const [courtName, setCourtName] = useState('');
  const [courtAddress, setCourtAddress] = useState('');
  const [courtCity, setCourtCity] = useState('');
  const [courtPhone, setCourtPhone] = useState('');
  const [courtType, setCourtType] = useState<'futbol' | 'basketball' | 'tennis' | 'volleyball' | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [isPublic, setIsPublic] = useState(true);
  const [description, setDescription] = useState('');
  const [state, setState] = useState(true);
  const [subcourts, setSubcourts] = useState<{ subcourtName: string; state: boolean }[]>([
    { subcourtName: '', state: true },
  ]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Estado para guardar el usuario creado y controlar la vista
  const [newUser, setNewUser] = useState<{ id: string } | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleAddSubcourt = () => {
    setSubcourts([...subcourts, { subcourtName: '', state: true }]);
  };

  const handleSubcourtChange = (index: number, field: 'subcourtName' | 'state', value: string | boolean) => {
    const newSubcourts = [...subcourts];
    if (field === 'subcourtName') {
      newSubcourts[index].subcourtName = value as string;
    } else if (field === 'state') {
      newSubcourts[index].state = value as boolean;
    }
    setSubcourts(newSubcourts);
  };

  const handleRemoveSubcourt = (index: number) => {
    const newSubcourts = subcourts.filter((_, i) => i !== index);
    setSubcourts(newSubcourts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (password !== confirmPassword) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error de registro',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }
    if (password.length < 6) {
      setLoading(false);
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña débil',
        text: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return;
    }

    let dataToSend: any;
    let registerFunction: (data: any) => Promise<any>;

    if (role === 'admin') {
      dataToSend = {
        email,
        password,
        name,
        role,
        phone,
        courtName,
        courtAddress,
        courtCity,
        courtPhone,
        court_type: courtType,
        price: price === '' ? 0 : Number(price),
        is_public: isPublic,
        description,
        state,
        subcourts: subcourts.map((sc) => ({
          subcourtName: sc.subcourtName,
          state: sc.state,
        })),
      };
      registerFunction = register;
    } else {
      // proveedor
      dataToSend = {
        email,
        password,
        name,
        role,
        phone,
      };
      registerFunction = onRegisterProveedor;
    }

    try {
      const response = await registerFunction(dataToSend);
      console.log(response)
      if(response.success === true){
      const createdUser = response?.user;

      if (createdUser) {
        setNewUser({ id: createdUser });
        setIsRegistered(true);

        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Serás redirigido a tu panel',
          timer: 2500,
          timerProgressBar: true,
        });

             if (role === 'proveedor') {
            // Redirigir inmediatamente al dashboard del proveedor
            // Asume que la ruta es /proveedor/dashboard o similar
            navigate('/dashboard'); 
        } else {
            // Lógica existente para el Admin (continúa con la subida de imágenes)
            setNewUser({ id: createdUser });
            setIsRegistered(true);
        }

      } else {
        throw new Error('No se pudo obtener información de usuario registrado');
      }
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      let errorMessage = 'Hubo un problema al crear tu cuenta. Por favor, intenta de nuevo.';

      if (err.response && err.response.data && err.response.data.errors) {
        const serverErrors = err.response.data.errors;
        errorMessage = serverErrors.map((e: any) => e.msg).join(' - ');
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
            {isRegistered ? 'Subir imágenes de la Cancha' : 'Crear Cuenta'}
          </h2>
          {!isRegistered && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Inicia sesión aquí
              </Link>
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

              {/* Selector de rol */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tipo de Rol
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="role"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'proveedor')}
                  >
                    <option value="admin">Admin (Registra Canchas)</option>
                    <option value="proveedor">Proveedor (Registra Servicios)</option>
                  </select>
                </div>
              </div>

              {/* Campos básicos */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Teléfono
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="phone"
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="+123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Campos específicos para Admin */}
              {role === 'admin' && (
                <>
                  <div>
                    <label
                      htmlFor="courtName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Nombre de la cancha
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="courtName"
                        type="text"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Nombre de tu cancha"
                        value={courtName}
                        onChange={(e) => setCourtName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="courtAddress"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Dirección
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="courtAddress"
                        type="text"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Dirección completa"
                        value={courtAddress}
                        onChange={(e) => setCourtAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="courtCity"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
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

                  <div>
                    <label
                      htmlFor="courtPhone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Teléfono de la cancha
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="courtPhone"
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Teléfono de contacto"
                        value={courtPhone}
                        onChange={(e) => setCourtPhone(e.target.value)}
                      />
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
                              | 'futbol'
                              | 'basketball'
                              | 'tennis'
                              | 'volleyball'
                              | ''
                          )
                        }
                      >
                        <option value="">Selecciona un tipo</option>
                        <option value="futbol">Fútbol</option>
                        <option value="basketball">Basketball</option>
                        <option value="tennis">Tennis</option>
                        <option value="volleyball">Volleyball</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Precio por hora
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="price"
                        type="number"
                        min={0}
                        step={0.01}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Precio en moneda local"
                        value={price}
                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      id="isPublic"
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
                      Cancha pública
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Describe tu cancha"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-3 mb-2">
                    <input
                      id="state"
                      type="checkbox"
                      checked={state}
                      onChange={(e) => setState(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="state" className="text-sm text-gray-700 dark:text-gray-300">
                      Activa la cancha
                    </label>
                  </div>

                  {/* Subcancha */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subcanchas
                    </label>
                    {subcourts.map((subcourt, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          placeholder="Nombre subcancha"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          value={subcourt.subcourtName}
                          onChange={(e) => handleSubcourtChange(index, 'subcourtName', e.target.value)}
                        />
                        <input
                          type="checkbox"
                          checked={subcourt.state}
                          onChange={(e) => handleSubcourtChange(index, 'state', e.target.checked)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          title="Activa/Desactiva subcancha"
                        />
                        {subcourts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubcourt(index)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar subcancha"
                          >
                            <MinusCircle size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddSubcourt}
                      className="inline-flex items-center px-3 py-1 rounded-md text-green-600 hover:text-green-800"
                    >
                      <PlusCircle size={18} />
                      <span className="ml-1 text-sm">Agregar subcancha</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div>
              <Button
                type="submit"
                className="w-full py-3 mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </Button>
            </div>
          </form>
        ) : (
          // Solo muestra ImageSelector cuando el usuario está registrado
          newUser && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Sube imágenes de tu cancha
              </h3>
              <div>{newUser.id} </div>
              <ImageSelector userId={newUser.id} />
            </div>
          )
        )}
      </div>
    </div>
  );
};
