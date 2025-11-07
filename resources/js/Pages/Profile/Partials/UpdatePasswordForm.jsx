import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <div className="profile-card">
            <div className="profile-card-header">
                <h2 className="profile-card-title">Actualizar Contraseña</h2>
                <p className="profile-card-description">
                    Asegúrate de que tu cuenta use una contraseña larga y aleatoria para mantenerla segura.
                </p>
            </div>

            <form onSubmit={updatePassword} className="profile-form">
                <div className="profile-form-group">
                    <label htmlFor="current_password" className="profile-label">
                        Contraseña Actual *
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        className="profile-input"
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        autoComplete="current-password"
                        required
                    />
                    <InputError
                        message={errors.current_password}
                        className="profile-error"
                    />
                </div>

                <div className="profile-form-group">
                    <label htmlFor="password" className="profile-label">
                        Nueva Contraseña *
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        className="profile-input"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                    <InputError message={errors.password} className="profile-error" />
                </div>

                <div className="profile-form-group">
                    <label htmlFor="password_confirmation" className="profile-label">
                        Confirmar Contraseña *
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        className="profile-input"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        autoComplete="new-password"
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="profile-error"
                    />
                </div>

                <div className="profile-form-actions">
                    <button
                        type="submit"
                        disabled={processing}
                        className="dashboard-btn dashboard-btn-primary"
                    >
                        {processing ? 'Guardando...' : 'Guardar Contraseña'}
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
                            <span>Contraseña actualizada exitosamente</span>
                        </div>
                    </Transition>
                </div>
            </form>
        </div>
    );
}
