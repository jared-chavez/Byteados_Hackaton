import Dropdown from '@/Components/Dropdown';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FaCoffee } from 'react-icons/fa';
import useSessionTimeout from '@/hooks/useSessionTimeout';
import useAuthGuard from '@/hooks/useAuthGuard';
import ConfirmModal from '@/Components/ConfirmModal';
import '../../css/dashboard.css';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Proteger la ruta: si no hay usuario, redirigir al login
    useAuthGuard();

    // Si no hay usuario, no renderizar nada (el hook ya redirige)
    if (!user) {
        return null;
    }

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Usar el hook de timeout de sesión (120 minutos por defecto, configurable desde config/session.php)
    const { sessionWarning } = useSessionTimeout(120);
    
    // Convertir sessionWarning al formato de ConfirmModal
    const sessionConfirm = sessionWarning.show ? {
        show: true,
        title: 'Sesión por expirar',
        message: `Tu sesión expirará en ${sessionWarning.remainingMinutes} minutos por inactividad. ¿Deseas continuar?`,
        confirmText: 'Continuar',
        cancelText: 'Cerrar sesión',
        variant: 'warning',
        onConfirm: sessionWarning.onConfirm,
        onCancel: sessionWarning.onCancel,
    } : { show: false };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="authenticated-layout">
            <nav className="auth-navbar">
                <div className="auth-navbar-content">
                    <Link href="/" className="navbar-logo">
                        <span className="auth-logo-japanese">
                            <FaCoffee size={28} aria-hidden="true" />
                        </span>
                        <span className="auth-logo-text">XpressUTC</span>
                    </Link>

                    <div className="auth-navbar-links">
                        <Link
                            href={route('dashboard')}
                            className={`auth-nav-link ${route().current('dashboard') ? 'active' : ''}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={route('menu.index')}
                            className={`auth-nav-link ${route().current('menu.index') ? 'active' : ''}`}
                        >
                            Menú
                        </Link>
                        <Link
                            href={route('orders.index')}
                            className={`auth-nav-link ${route().current('orders.index') ? 'active' : ''}`}
                        >
                            Mis Órdenes
                        </Link>
                        <Link
                            href={route('cart.index')}
                            className={`auth-nav-link ${route().current('cart.index') ? 'active' : ''}`}
                        >
                            Carrito
                        </Link>
                    </div>

                    <div className="auth-user-menu">
                        <div className="auth-user-info hidden md:block">
                            <div className="auth-user-name">{user.name}</div>
                            <div className="auth-user-email">{user.email}</div>
                        </div>
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:bg-white/10 focus:outline-none"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xs font-bold text-white mr-2">
                                                {getInitials(user.name)}
                                            </div>
                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link
                                        href={route('profile.edit')}
                                    >
                                        Perfil
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Cerrar Sesión
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() =>
                                setShowingNavigationDropdown(
                                    (previousState) => !previousState,
                                )
                            }
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 transition duration-150 ease-in-out hover:bg-white/10 hover:text-white focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={
                                        !showingNavigationDropdown
                                            ? 'inline-flex'
                                            : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={
                                        showingNavigationDropdown
                                            ? 'inline-flex'
                                            : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' md:hidden'
                    }
                    style={{
                        background: 'rgba(15, 15, 15, 0.98)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '1rem 6%'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Link
                            href={route('dashboard')}
                            className="auth-nav-link"
                            onClick={() => setShowingNavigationDropdown(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={route('menu.index')}
                            className="auth-nav-link"
                            onClick={() => setShowingNavigationDropdown(false)}
                        >
                            Menú
                        </Link>
                        <Link
                            href={route('orders.index')}
                            className="auth-nav-link"
                            onClick={() => setShowingNavigationDropdown(false)}
                        >
                            Mis Órdenes
                        </Link>
                        <Link
                            href={route('cart.index')}
                            className="auth-nav-link"
                            onClick={() => setShowingNavigationDropdown(false)}
                        >
                            Carrito
                        </Link>
                    </div>

                    <div style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingTop: '1rem',
                        marginTop: '1rem'
                    }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ color: '#ffffff', fontWeight: 600, marginBottom: '0.25rem' }}>
                                {user.name}
                            </div>
                            <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                                {user.email}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link
                                href={route('profile.edit')}
                                className="auth-nav-link"
                                onClick={() => setShowingNavigationDropdown(false)}
                            >
                                Perfil
                            </Link>
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="auth-nav-link"
                                onClick={() => setShowingNavigationDropdown(false)}
                            >
                                Cerrar Sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header style={{
                    background: 'var(--background-card)',
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '2rem 6%',
                    marginTop: '70px'
                }}>
                    <div className="auth-container">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
            <ConfirmModal confirm={sessionConfirm} />
        </div>
    );
}
