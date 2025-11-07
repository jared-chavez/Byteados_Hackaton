import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true; // Enviar cookies de sesión con las peticiones

// Interceptor simple para detectar sesiones expiradas (401/419/409)
// Redirige al login cuando la sesión se destruye o hay conflictos
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si la sesión expiró, fue destruida o hay conflicto, redirigir al login
        if (error.response && (error.response.status === 401 || error.response.status === 419 || error.response.status === 409)) {
            // Solo redirigir si no estamos ya en la página de login
            const currentPath = window.location.pathname;
            const loginPath = route('login').replace(window.location.origin, '');
            
            if (currentPath !== loginPath && !currentPath.includes('/login')) {
                // Usar window.location.href para forzar recarga completa y evitar conflictos
                window.location.href = route('login');
            }
        }
        return Promise.reject(error);
    }
);
