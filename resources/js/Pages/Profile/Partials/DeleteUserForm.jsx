import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <div className={`profile-card profile-card-danger ${className}`}>
            <div className="profile-card-header">
                <h2 className="profile-card-title">Eliminar Cuenta</h2>
                <p className="profile-card-description">
                    Una vez que se elimine tu cuenta, todos sus recursos y datos se eliminarán permanentemente. 
                    Antes de eliminar tu cuenta, descarga cualquier dato o información que desees conservar.
                </p>
            </div>

            <button
                onClick={confirmUserDeletion}
                className="dashboard-btn dashboard-btn-danger"
            >
                Eliminar Cuenta
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="profile-modal-form">
                    <div className="profile-modal-header">
                        <div className="profile-modal-icon">
                            <FaExclamationTriangle className="w-8 h-8" />
                        </div>
                        <h2 className="profile-modal-title">
                            ¿Estás seguro de que deseas eliminar tu cuenta?
                        </h2>
                    </div>

                    <p className="profile-modal-description">
                        Una vez que se elimine tu cuenta, todos sus recursos y datos se eliminarán permanentemente. 
                        Por favor, ingresa tu contraseña para confirmar que deseas eliminar permanentemente tu cuenta.
                    </p>

                    <div className="profile-form-group">
                        <label htmlFor="password" className="profile-label">
                            Contraseña *
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="profile-input"
                            placeholder="Ingresa tu contraseña"
                            required
                        />

                        <InputError
                            message={errors.password}
                            className="profile-error"
                        />
                    </div>

                    <div className="profile-modal-actions">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="dashboard-btn dashboard-btn-secondary"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="dashboard-btn dashboard-btn-danger"
                        >
                            {processing ? 'Eliminando...' : 'Eliminar Cuenta'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
