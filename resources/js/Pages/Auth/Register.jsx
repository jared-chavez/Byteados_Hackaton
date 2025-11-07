import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Registro" />
            
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
                        <h1 className="text-2xl font-semibold text-white mb-2">Crea tu cuenta</h1>
                        <p className="text-gray-400 text-sm">Únete a una red de arquitectos distinguidos apasionados por el diseño excepcional.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                Nombre completo *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={data.name}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Juan Pérez"
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2 text-red-400" />
                        </div>

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
                                placeholder="matricula@alumno.utc.edu.mx"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2 text-red-400" />
                            </div>
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirmar contraseña *
                                </label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="••••••••••••"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2 text-red-400" />
                            </div>
                        </div>

                        <div className="text-xs text-gray-400">
                            Al crear una cuenta, aceptas nuestros{' '}
                            <a href="#" className="text-green-400 hover:underline">Términos de Servicio</a>
                            {' '}y{' '}
                            <a href="#" className="text-green-400 hover:underline">Política de Privacidad</a>.
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-lg transition duration-200"
                        >
                            {processing ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>

                        <div className="text-center">
                            <span className="text-gray-400 text-sm">¿Ya tienes una cuenta? </span>
                            <Link
                                href={route('login')}
                                className="text-green-400 hover:underline text-sm font-medium"
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