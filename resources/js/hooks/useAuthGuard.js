import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Hook simple para proteger rutas autenticadas
 * Redirige al login si el usuario no está autenticado
 * Lógica simple para evitar problemas de compilación y conflictos 409
 */
export default function useAuthGuard() {
    const { auth } = usePage().props;

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const isAuthenticated = auth && auth.user && auth.user.id;
        
        // Verificar si ya estamos en la página de login para evitar redirecciones innecesarias
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.includes('/login') || currentPath === route('login').replace(window.location.origin, '');
        
        // Si no hay usuario autenticado y no estamos en login, redirigir
        if (!isAuthenticated && !isLoginPage) {
            // Usar window.location.href directamente para evitar peticiones que causen 409
            // Esto fuerza una recarga completa y evita conflictos con tokens CSRF
            window.location.href = route('login');
        }
    }, [auth?.user?.id]); // Solo re-ejecutar si cambia el ID del usuario
}

