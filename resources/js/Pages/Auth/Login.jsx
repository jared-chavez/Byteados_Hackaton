import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Iniciar Sesión" />
            
            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent z-10"></div>
                <img 
                    src="/images/auth-bg.jpg" 
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
                        <h1 className="text-2xl font-semibold text-white mb-2">Bienvenido de vuelta</h1>
                        <p className="text-gray-400 text-sm">Inicia sesión en tu cuenta para continuar tu viaje arquitectónico.</p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-400">{status}</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Correo electrónico *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="alumno@alumno.utc.edu.mx"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Contraseña *
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="••••••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-green-500 bg-gray-900 border-gray-700 rounded focus:ring-green-500 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-300">Recordarme</span>
                            </label>
                            
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-green-400 hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-lg transition duration-200"
                        >
                            {processing ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>

                        <div className="text-center">
                            <span className="text-gray-400 text-sm">¿No tienes una cuenta? </span>
                            <Link
                                href={route('register')}
                                className="text-green-400 hover:underline text-sm font-medium"
                            >
                                Registrarse
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}