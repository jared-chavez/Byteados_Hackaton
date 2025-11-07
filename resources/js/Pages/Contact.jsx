import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import '../../css/dashboard.css';

export default function Contact({ auth }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [validationErrors, setValidationErrors] = useState({});

    // Mostrar mensaje de éxito si existe
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica del cliente
        const clientErrors = {};
        if (!data.name.trim()) {
            clientErrors.name = 'El nombre es requerido.';
        }
        if (!data.email.trim()) {
            clientErrors.email = 'El correo electrónico es requerido.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            clientErrors.email = 'Debe ser un correo electrónico válido.';
        }
        if (!data.subject.trim()) {
            clientErrors.subject = 'El asunto es requerido.';
        }
        if (!data.message.trim()) {
            clientErrors.message = 'El mensaje es requerido.';
        } else if (data.message.trim().length < 10) {
            clientErrors.message = 'El mensaje debe tener al menos 10 caracteres.';
        }

        if (Object.keys(clientErrors).length > 0) {
            setValidationErrors(clientErrors);
            return;
        }

        setValidationErrors({});

        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: (page) => {
                reset();
                setValidationErrors({});
                // El mensaje de éxito viene en flash.success
                if (page.props.flash?.success) {
                    toast.success(page.props.flash.success);
                } else {
                    toast.success('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
                }
            },
            onError: (errors) => {
                // Mostrar errores del servidor
                if (errors.email) {
                    toast.error(errors.email);
                } else if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
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

    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout header={<h2 className="font-semibold text-xl text-white leading-tight">Contacto</h2>}>
            <Head title="Contacto" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden shadow-lg sm:rounded-lg">
                        <div className="p-6 text-white">
                            <div className="max-w-2xl mx-auto">
                                <h1 className="text-3xl font-bold text-white mb-2">Contáctanos</h1>
                                <p className="text-gray-300 mb-8">
                                    ¿Tienes alguna pregunta, sugerencia o comentario? Estamos aquí para ayudarte.
                                    Completa el formulario y nos pondremos en contacto contigo pronto.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                    {/* Nombre */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                            Nombre completo <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                            required
                                            className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                                                (validationErrors.name || errors.name)
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-700 focus:ring-green-500 focus:border-green-500'
                                            }`}
                                            placeholder="Juan Pérez"
                                        />
                                        {(validationErrors.name || errors.name) && (
                                            <p className="mt-1 text-sm text-red-400">
                                                {validationErrors.name || errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                            Correo electrónico <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                            required
                                            className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                                                (validationErrors.email || errors.email)
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-700 focus:ring-green-500 focus:border-green-500'
                                            }`}
                                            placeholder="tu@correo.com"
                                        />
                                        {(validationErrors.email || errors.email) && (
                                            <p className="mt-1 text-sm text-red-400">
                                                {validationErrors.email || errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Asunto */}
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                            Asunto <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) => handleFieldChange('subject', e.target.value)}
                                            required
                                            className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                                                (validationErrors.subject || errors.subject)
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-700 focus:ring-green-500 focus:border-green-500'
                                            }`}
                                            placeholder="¿En qué podemos ayudarte?"
                                        />
                                        {(validationErrors.subject || errors.subject) && (
                                            <p className="mt-1 text-sm text-red-400">
                                                {validationErrors.subject || errors.subject}
                                            </p>
                                        )}
                                    </div>

                                    {/* Mensaje */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                            Mensaje <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={data.message}
                                            onChange={(e) => handleFieldChange('message', e.target.value)}
                                            required
                                            rows="6"
                                            maxLength="2000"
                                            className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition resize-none ${
                                                (validationErrors.message || errors.message)
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-700 focus:ring-green-500 focus:border-green-500'
                                            }`}
                                            placeholder="Escribe tu mensaje aquí..."
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            {(validationErrors.message || errors.message) && (
                                                <p className="text-sm text-red-400">
                                                    {validationErrors.message || errors.message}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400 ml-auto">
                                                {data.message.length}/2000 caracteres
                                            </p>
                                        </div>
                                    </div>

                                    {/* Botón de envío */}
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
                                        >
                                            {processing ? 'Enviando...' : 'Enviar mensaje'}
                                        </button>
                                    </div>
                                </form>

                                {/* Información de contacto adicional */}
                                <div className="mt-12 pt-8 border-t border-gray-700">
                                    <h2 className="text-xl font-semibold text-white mb-4">Otras formas de contacto</h2>
                                    <div className="space-y-3 text-gray-300">
                                        <p>
                                            <strong className="text-white">Email:</strong>{' '}
                                            <a href="mailto:cafe@utc.edu.co" className="text-green-400 hover:text-green-300 hover:underline">
                                                cafe@utc.edu.co
                                            </a>
                                        </p>
                                        <p>
                                            <strong className="text-white">Teléfono:</strong> (605) 123-4567
                                        </p>
                                        <p>
                                            <strong className="text-white">Ubicación:</strong> UTC Campus, Central Building, Ground Floor
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

