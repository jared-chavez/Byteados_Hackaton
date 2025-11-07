import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import React, { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const appName = import.meta.env.VITE_APP_NAME || 'XpressUTC';

// Interceptor global para errores de Inertia (409, 401, 419)
// Maneja conflictos de sesión y redirige al login
router.on('error', (event) => {
    const status = event.detail?.response?.status || event.detail?.status;
    
    // Si hay error de sesión (401, 419, 409), redirigir al login
    if (status === 401 || status === 419 || status === 409) {
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.includes('/login');
        
        if (!isLoginPage) {
            // Usar window.location.href para forzar recarga completa
            window.location.href = route('login');
        }
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <React.StrictMode>
                <App {...props} />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    toastClassName="!bg-[#1a1a1a] !border !border-[#2a2a2a] !text-white"
                    progressClassName="!bg-green-500"
                />
            </React.StrictMode>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
