import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FaCheckCircle } from 'react-icons/fa';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    const getUserTypeLabel = (type) => {
        return type === 'student' ? 'Estudiante' : 'Profesor';
    };

    return (
        <div className="profile-card">
            <div className="profile-card-header">
                <h2 className="profile-card-title">Información del Perfil</h2>
                <p className="profile-card-description">
                    Actualiza la información de tu cuenta y dirección de correo electrónico.
                </p>
            </div>

            <form onSubmit={submit} className="profile-form">
                <div className="profile-form-group">
                    <label htmlFor="name" className="profile-label">
                        Nombre completo *
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="profile-input"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="profile-error" message={errors.name} />
                </div>

                <div className="profile-form-group">
                    <label htmlFor="email" className="profile-label">
                        Correo electrónico *
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="profile-input"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="profile-error" message={errors.email} />
                </div>

                <div className="profile-form-group">
                    <label htmlFor="phone" className="profile-label">
                        Teléfono
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        className="profile-input"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        autoComplete="tel"
                        placeholder="1234567890"
                    />
                    <InputError className="profile-error" message={errors.phone} />
                </div>

                <div className="profile-info-grid">
                    <div className="profile-info-item">
                        <div className="profile-info-label">Tipo de Usuario</div>
                        <div className="profile-info-value">{getUserTypeLabel(user.user_type)}</div>
                    </div>
                    {user.student_id && (
                        <div className="profile-info-item">
                            <div className="profile-info-label">Matrícula</div>
                            <div className="profile-info-value">{user.student_id}</div>
                        </div>
                    )}
                    <div className="profile-info-item">
                        <div className="profile-info-label">Estado</div>
                        <div className="profile-info-value">{user.status === 'active' ? 'Activo' : 'Inactivo'}</div>
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="profile-verification">
                        <p className="profile-verification-text">
                            Tu dirección de correo electrónico no está verificada.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="profile-verification-link"
                            >
                                Haz clic aquí para reenviar el correo de verificación.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="profile-verification-success">
                                Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico.
                            </div>
                        )}
                    </div>
                )}

                <div className="profile-form-actions">
                    <button
                        type="submit"
                        disabled={processing}
                        className="dashboard-btn dashboard-btn-primary"
                    >
                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="profile-success-message">
                            <FaCheckCircle className="w-5 h-5" />
                            <span>Guardado exitosamente</span>
                        </div>
                    </Transition>
                </div>
            </form>
        </div>
    );
}
