import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import '../../../css/dashboard.css';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Perfil" />
            <div className="auth-main-content">
                <div className="auth-container">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Mi Perfil</h1>
                        <p className="dashboard-subtitle">Gestiona tu información personal y configuración de cuenta</p>
                    </div>

                    <div className="profile-section">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="profile-section">
                        <UpdatePasswordForm />
                    </div>

                    <div className="profile-section profile-section-danger">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
