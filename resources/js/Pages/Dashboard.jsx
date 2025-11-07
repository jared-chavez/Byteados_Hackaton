import { Head, usePage, router } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;

    if (!user) {
    return (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <h1>No autenticado</h1>
                <button
                    onClick={() => router.visit(route('login'))}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Ir a Login
                </button>
            </div>
        );
    }

    const handleLogout = () => {
        router.post(route('logout'), {}, {
            onSuccess: () => {
                router.reload({ only: ['auth'] });
            }
        });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <Head title="Dashboard" />

            <h1>Dashboard - Testing</h1>
            
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                <h2>Usuario Autenticado:</h2>
                <p><strong>Nombre:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {user.user_type && <p><strong>Tipo:</strong> {user.user_type}</p>}
                        </div>

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={() => router.visit(route('orders.index'))}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Ver Historial de Órdenes
                </button>

                <button
                    onClick={() => router.visit(route('menu.index'))}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Ver Menú
                </button>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Cerrar Sesión
                </button>

                <button
                    onClick={() => router.visit('/')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Ir a Inicio
                </button>
            </div>
        </div>
    );
}
