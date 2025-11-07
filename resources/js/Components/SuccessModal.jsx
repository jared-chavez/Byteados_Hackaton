import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link } from '@inertiajs/react';

export default function SuccessModal({ show, onClose, title, message, email }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md" closeable={false}>
            <div className="p-6">
                {/* Icono de éxito animado */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 animate-pulse">
                    <svg
                        className="h-10 w-10 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Título */}
                <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {title || '¡Registro Exitoso!'}
                    </h3>
                </div>

                {/* Mensaje */}
                <div className="mt-4">
                    <p className="text-center text-sm text-gray-600">
                        {message || 'Tu cuenta ha sido creada exitosamente.'}
                    </p>
                    
                    {email && (
                        <div className="mt-4 rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-blue-900">
                                        Correo de verificación enviado
                                    </p>
                                    <p className="mt-1 text-xs text-blue-700">
                                        Hemos enviado un correo de verificación a:
                                    </p>
                                    <p className="mt-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-blue-900 shadow-sm">
                                        {email}
                                    </p>
                                    <div className="mt-3 rounded-md bg-blue-100 p-2">
                                        <p className="text-xs text-blue-800">
                                            <strong>📬 Próximos pasos:</strong>
                                        </p>
                                        <ul className="mt-1 ml-4 list-disc text-xs text-blue-700">
                                            <li>Revisa tu bandeja de entrada</li>
                                            <li>Haz clic en el enlace de verificación</li>
                                            <li>Activa tu cuenta para comenzar a comprar</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Botones */}
                <div className="mt-6 flex justify-center space-x-3">
                    <PrimaryButton onClick={onClose} className="min-w-[120px]">
                        Entendido
                    </PrimaryButton>
                </div>

                {/* Link adicional */}
                {email && (
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            ¿No recibiste el correo?{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                className="font-medium text-blue-600 hover:text-blue-800 underline"
                            >
                                Reenviar correo
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
}

