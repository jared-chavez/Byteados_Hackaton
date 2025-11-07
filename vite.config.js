import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // IMPORTANTE: Separar vendor chunks asegurando que React se carga primero
                    // 
                    // PROBLEMA RESUELTO: "Cannot set properties of undefined (setting 'Children')"
                    // Causa: use-sync-external-store y scheduler son dependencias directas de React.
                    // Si se separan en vendor-other, se ejecutan antes de que React esté inicializado,
                    // causando que el objeto 'de' (exports de React) sea undefined cuando se intenta
                    // asignar de.Children.
                    //
                    // SOLUCIÓN: Mantener todas las dependencias directas de React en el mismo chunk
                    // para garantizar el orden correcto de inicialización.
                    if (id.includes('node_modules')) {
                        // React y sus dependencias directas DEBEN estar juntas
                        if (id.includes('react') || id.includes('react-dom') || 
                            id.includes('scheduler') || id.includes('use-sync-external-store')) {
                            return 'vendor-react';
                        }
                        if (id.includes('@inertiajs')) {
                            return 'vendor-inertia';
                        }
                        if (id.includes('react-icons')) {
                            return 'vendor-icons';
                        }
                        if (id.includes('react-toastify')) {
                            return 'vendor-toastify';
                        }
                        if (id.includes('zod')) {
                            return 'vendor-zod';
                        }
                        // Otros node_modules van a vendor-other
                        return 'vendor-other';
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000,
        cssCodeSplit: true, // Separar CSS en chunks para mejor caching
    },
    optimizeDeps: {
        include: ['react', 'react-dom', '@inertiajs/react'],
        exclude: ['react-toastify'], // Excluir para lazy loading
    },
});
