import { Head, usePage, router } from '@inertiajs/react';
import { FaCoffee, FaClipboardList, FaShoppingCart } from 'react-icons/fa';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../css/dashboard.css';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;

    if (!user) {
        return (
            <div className="authenticated-layout" role="main">
                <div className="auth-main-content">
                    <div className="auth-container">
                        <div className="dashboard-card" role="alert">
                            <h2 className="dashboard-card-title">No autenticado</h2>
                            <p className="dashboard-card-description">Por favor, inicia sesión para acceder al dashboard.</p>
                            <button
                                onClick={() => router.visit(route('login'))}
                                className="dashboard-btn dashboard-btn-primary focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                                aria-label="Ir a la página de inicio de sesión"
                            >
                                Ir a Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getUserTypeLabel = (type) => {
        return type === 'student' ? 'Estudiante' : 'Profesor';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            
            <main className="auth-main-content" role="main" aria-label="Panel de control principal">
                <div className="auth-container">
                    {/* Header */}
                    <header className="dashboard-header" role="banner">
                        <h1 className="dashboard-title">Bienvenido de vuelta</h1>
                        <p className="dashboard-subtitle">Gestiona tus pedidos y disfruta de la mejor experiencia en XpressUTC</p>
                    </header>

                    {/* User Info Card */}
                    <section className="user-info-card" aria-labelledby="user-info-heading">
                        <div className="user-info-header">
                            <div 
                                className="user-avatar" 
                                role="img" 
                                aria-label={`Avatar de ${user.name}`}
                                aria-hidden="false"
                            >
                                <span aria-hidden="true">{getInitials(user.name)}</span>
                            </div>
                            <div className="user-info-details">
                                <h3 id="user-info-heading">{user.name}</h3>
                                <p>
                                    <a 
                                        href={`mailto:${user.email}`}
                                        className="text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-1"
                                        aria-label={`Enviar correo a ${user.email}`}
                                    >
                                        {user.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className="user-info-grid" role="list">
                            <div className="user-info-item" role="listitem">
                                <div className="user-info-item-label">Tipo de Usuario</div>
                                <div className="user-info-item-value" aria-label={`Tipo de usuario: ${getUserTypeLabel(user.user_type)}`}>
                                    {getUserTypeLabel(user.user_type)}
                                </div>
                            </div>
                            <div className="user-info-item" role="listitem">
                                <div className="user-info-item-label">Estado</div>
                                <div className="user-info-item-value" aria-label="Estado de la cuenta: Activo">
                                    <span aria-hidden="true">Activo</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions Grid */}
                    <section className="dashboard-grid" aria-labelledby="quick-actions-heading">
                        <h2 id="quick-actions-heading" className="sr-only">Acciones rápidas</h2>
                        <article className="dashboard-card" role="article" aria-labelledby="menu-card-title">
                            <div className="dashboard-card-icon" aria-hidden="true">
                                <FaCoffee size={28} />
                            </div>
                            <h3 id="menu-card-title" className="dashboard-card-title">Ver Menú</h3>
                            <p className="dashboard-card-description">
                                Explora nuestro menú completo de bebidas, snacks y combos especiales.
                            </p>
                            <a
                                href={route('menu.index')}
                                className="dashboard-card-action focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                                aria-label="Ir al menú completo de productos"
                            >
                                <span>Ver Menú</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </article>

                        <article className="dashboard-card" role="article" aria-labelledby="orders-card-title">
                            <div className="dashboard-card-icon" aria-hidden="true">
                                <FaClipboardList size={28} />
                            </div>
                            <h3 id="orders-card-title" className="dashboard-card-title">Mis Órdenes</h3>
                            <p className="dashboard-card-description">
                                Revisa el historial de tus pedidos y su estado actual.
                            </p>
                            <a
                                href={route('orders.index')}
                                className="dashboard-card-action focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                                aria-label="Ver historial de órdenes y pedidos"
                            >
                                <span>Ver Órdenes</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </article>

                        <article className="dashboard-card" role="article" aria-labelledby="cart-card-title">
                            <div className="dashboard-card-icon" aria-hidden="true">
                                <FaShoppingCart size={28} />
                            </div>
                            <h3 id="cart-card-title" className="dashboard-card-title">Carrito</h3>
                            <p className="dashboard-card-description">
                                Gestiona los productos en tu carrito de compras.
                            </p>
                            <a
                                href={route('cart.index')}
                                className="dashboard-card-action focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                                aria-label="Ver y gestionar carrito de compras"
                            >
                                <span>Ver Carrito</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </article>
                    </section>

                    {/* Action Buttons */}
                    <nav className="dashboard-actions" aria-label="Navegación secundaria">
                        <button
                            onClick={() => router.visit('/')}
                            className="dashboard-btn dashboard-btn-secondary focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                            aria-label="Ir a la página de inicio"
                        >
                            Ir a Inicio
                        </button>
                        <a
                            href={route('profile.edit')}
                            className="dashboard-btn dashboard-btn-outline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                            aria-label="Editar información del perfil"
                        >
                            Editar Perfil
                        </a>
                    </nav>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
