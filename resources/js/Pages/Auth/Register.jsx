import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import LazyImage from '@/Components/LazyImage';
import { registerSchema, validateForm } from '@/validations/authSchemas';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_type: 'student',
        phone: '',
    });

    const [validationErrors, setValidationErrors] = useState({});

    const submit = (e) => {
        e.preventDefault();
        
        console.log('Formulario enviado, datos:', { ...data, password: '***', password_confirmation: '***' });

        // Validar con schema
        const validation = validateForm(registerSchema, data);
        console.log('Validación del schema:', validation);
        
        if (!validation.success) {
            console.log('Errores de validación:', validation.errors);
            setValidationErrors(validation.errors);
            return;
        }

        // Limpiar errores de validación del cliente
        setValidationErrors({});
        
        console.log('Enviando petición POST a register...');
        
        // Usar la URL directamente si route() falla
        const registerUrl = route('register') || '/register';
        console.log('URL de registro:', registerUrl);
        
        post(registerUrl, {
            preserveScroll: true,
            onStart: () => {
                console.log('Iniciando petición POST a:', registerUrl);
            },
            onFinish: () => {
                console.log('Petición finalizada');
                reset('password', 'password_confirmation');
            },
            onSuccess: (page) => {
                console.log('Registro exitoso, redirigiendo...', page);
            },
            onError: (errors) => {
                console.error('Errores del servidor:', errors);
                // Los errores del servidor se manejan automáticamente por Inertia
                if (Object.keys(errors).length > 0) {
                    console.error('Errores detallados:', errors);
                }
            },
        });
    };

    const handleFieldChange = (field, value) => {
        setData(field, value);
        // Limpiar error al escribir
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFieldBlur = (field) => {
        // Validar campo individual al salir
        try {
            const validation = validateForm(registerSchema, { ...data, [field]: data[field] });
            if (!validation.success && validation.errors && validation.errors[field]) {
                setValidationErrors(prev => ({ ...prev, [field]: validation.errors[field] }));
            } else if (validation.success) {
                // Limpiar error si la validación es exitosa
                setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        } catch (error) {
            console.error('Error en handleFieldBlur:', error);
        }
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Registro" />
            
            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent z-10"></div>
                <LazyImage
                    src="/images/auth-bg.webp"
                    alt="Architecture"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-8 left-8 z-20 text-white max-w-md">
                    <h2 className="text-3xl font-bold mb-4">Diseña tu futuro, un proyecto a la vez.</h2>
                    <p className="text-lg mb-2">Únete a una comunidad de arquitectos formando el mañana</p>
                    <p className="text-sm opacity-80">Structure — Tu puerta de entrada a la excelencia arquitectónica</p>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-white mb-2">Crea tu cuenta</h1>
                        <p className="text-gray-400 text-sm">Únete a una red de arquitectos distinguidos apasionados por el diseño excepcional.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6" noValidate aria-label="Formulario de registro">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                Nombre completo <span className="text-red-400" aria-label="requerido">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={data.name}
                                required
                                aria-required="true"
                                aria-invalid={!!(validationErrors.name || errors.name)}
                                aria-describedby={validationErrors.name || errors.name ? "name-error" : undefined}
                                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                    (validationErrors.name || errors.name) 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-700'
                                }`}
                                placeholder="Juan Pérez"
                                autoComplete="name"
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                onBlur={() => handleFieldBlur('name')}
                            />
                            {(validationErrors.name || errors.name) && (
                                <p id="name-error" className="mt-2 text-sm text-red-400" role="alert" aria-live="polite">
                                    {validationErrors.name || errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Correo electrónico <span className="text-red-400" aria-label="requerido">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                required
                                aria-required="true"
                                aria-invalid={!!(validationErrors.email || errors.email)}
                                aria-describedby={validationErrors.email || errors.email ? "email-error" : undefined}
                                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                    (validationErrors.email || errors.email) 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-700'
                                }`}
                                placeholder="21045163@alumno.utc.edu.mx"
                                autoComplete="username"
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                onBlur={() => handleFieldBlur('email')}
                            />
                            {(validationErrors.email || errors.email) && (
                                <p id="email-error" className="mt-2 text-sm text-red-400" role="alert" aria-live="polite">
                                    {validationErrors.email || errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="user_type" className="block text-sm font-medium text-gray-300 mb-2">
                                Tipo de usuario <span className="text-red-400" aria-label="requerido">*</span>
                            </label>
                            <select
                                id="user_type"
                                name="user_type"
                                value={data.user_type}
                                required
                                aria-required="true"
                                aria-invalid={!!(validationErrors.user_type || errors.user_type)}
                                aria-describedby={validationErrors.user_type || errors.user_type ? "user_type-error" : undefined}
                                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                    (validationErrors.user_type || errors.user_type) 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-700'
                                }`}
                                onChange={(e) => handleFieldChange('user_type', e.target.value)}
                                onBlur={() => handleFieldBlur('user_type')}
                            >
                                <option value="student">Estudiante</option>
                                <option value="teacher">Profesor</option>
                            </select>
                            {(validationErrors.user_type || errors.user_type) && (
                                <p id="user_type-error" className="mt-2 text-sm text-red-400" role="alert" aria-live="polite">
                                    {validationErrors.user_type || errors.user_type}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                Teléfono <span className="text-gray-500 text-xs">(opcional)</span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={data.phone}
                                aria-invalid={!!(validationErrors.phone || errors.phone)}
                                aria-describedby={validationErrors.phone || errors.phone ? "phone-error" : undefined}
                                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                    (validationErrors.phone || errors.phone) 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-700'
                                }`}
                                placeholder="1234567890"
                                autoComplete="tel"
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                onBlur={() => handleFieldBlur('phone')}
                            />
                            {(validationErrors.phone || errors.phone) && (
                                <p id="phone-error" className="mt-2 text-sm text-red-400" role="alert" aria-live="polite">
                                    {validationErrors.phone || errors.phone}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Contraseña <span className="text-red-400" aria-label="requerido">*</span>
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={data.password}
                                    required
                                    aria-required="true"
                                    aria-invalid={!!(validationErrors.password || errors.password)}
                                    aria-describedby={validationErrors.password || errors.password ? "password-error" : "password-hint"}
                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        (validationErrors.password || errors.password) 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-700'
                                    }`}
                                    placeholder="••••••••••••"
                                    autoComplete="new-password"
                                    onChange={(e) => {
                                        handleFieldChange('password', e.target.value);
                                        // Si hay error de confirmación, validar de nuevo
                                        if (validationErrors.password_confirmation) {
                                            const validation = validateForm(registerSchema, { ...data, password: e.target.value });
                                            if (validation.success || !validation.errors.password_confirmation) {
                                                setValidationErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.password_confirmation;
                                                    return newErrors;
                                                });
                                            }
                                        }
                                    }}
                                    onBlur={() => handleFieldBlur('password')}
                                />
                                <p id="password-hint" className="mt-1 text-xs text-gray-500">
                                    Mínimo 8 caracteres, incluye mayúsculas, minúsculas, números y caracteres especiales
                                </p>
                                {(validationErrors.password || errors.password) && (
                                    <p id="password-error" className="mt-2 text-sm text-red-400" role="alert" aria-live="polite">
                                        {validationErrors.password || errors.password}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirmar contraseña <span className="text-red-400" aria-label="requerido">*</span>
                                </label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    required
                                    aria-required="true"
                                    aria-invalid={!!(validationErrors.password_confirmation || errors.password_confirmation)}
                                    aria-describedby={validationErrors.password_confirmation || errors.password_confirmation ? "password_confirmation-error" : undefined}
                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        (validationErrors.password_confirmation || errors.password_confirmation) 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-700'
                                    }`}
                                    placeholder="••••••••••••"
                                    autoComplete="new-password"
                                    onChange={(e) => handleFieldChange('password_confirmation', e.target.value)}
                                    onBlur={() => {
                                        // Validar confirmación de contraseña
                                        const validation = validateForm(registerSchema, data);
                                        if (!validation.success && validation.errors.password_confirmation) {
                                            setValidationErrors(prev => ({ ...prev, password_confirmation: validation.errors.password_confirmation }));
                                        }
                                    }}
                                />
                                {(validationErrors.password_confirmation || errors.password_confirmation) && (
                                    <p id="password_confirmation-error" className="mt-2 text-sm text-red-400" role="alert" aria-live="polite">
                                        {validationErrors.password_confirmation || errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="text-xs text-gray-400" role="note">
                            Al crear una cuenta, aceptas nuestros{' '}
                            <a 
                                href="#" 
                                className="text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-1"
                                aria-label="Leer términos de servicio"
                            >
                                Términos de Servicio
                            </a>
                            {' '}y{' '}
                            <a 
                                href="#" 
                                className="text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-1"
                                aria-label="Leer política de privacidad"
                            >
                                Política de Privacidad
                            </a>.
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            aria-busy={processing}
                            aria-label={processing ? 'Creando cuenta, por favor espera' : 'Crear cuenta'}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                        >
                            {processing ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>

                        <div className="text-center">
                            <span className="text-gray-400 text-sm">¿Ya tienes una cuenta? </span>
                            <Link
                                href={route('login')}
                                className="text-green-400 hover:underline text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-1"
                                aria-label="Ir a la página de inicio de sesión"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}