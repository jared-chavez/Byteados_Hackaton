import { useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

/**
 * Hook personalizado para manejar el timeout de sesión
 * Detecta cuando la sesión ha expirado por inactividad y cierra la sesión automáticamente
 * 
 * @param {number} timeoutMinutes - Tiempo de inactividad en minutos antes de cerrar sesión (default: 120)
 * @param {function} onSessionExpired - Callback opcional cuando la sesión expira
 */
export default function useSessionTimeout(timeoutMinutes = 120, onSessionExpired = null) {
    const { auth } = usePage().props;
    const timeoutRef = useRef(null);
    const warningTimeoutRef = useRef(null);
    const lastActivityRef = useRef(Date.now());
    const [sessionWarning, setSessionWarning] = useState({
        show: false,
        remainingMinutes: 0,
        onConfirm: null,
        onCancel: null,
    });

    useEffect(() => {
        if (!auth?.user) {
            // Si no hay usuario autenticado, no hacer nada
            return;
        }

        const timeoutMs = timeoutMinutes * 60 * 1000; // Convertir minutos a milisegundos
        const warningTime = timeoutMs - (5 * 60 * 1000); // Advertir 5 minutos antes

        // Función para resetear el timer
        const resetTimer = () => {
            lastActivityRef.current = Date.now();

            // Limpiar timers existentes
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current);
            }

            // Timer de advertencia (5 minutos antes de expirar)
            warningTimeoutRef.current = setTimeout(() => {
                // Mostrar advertencia al usuario usando modal
                const remainingMinutes = Math.ceil((timeoutMs - (Date.now() - lastActivityRef.current)) / 60000);
                setSessionWarning({
                    show: true,
                    remainingMinutes,
                    onConfirm: () => {
                        setSessionWarning(prev => ({ ...prev, show: false }));
                        resetTimer();
                    },
                    onCancel: () => {
                        setSessionWarning(prev => ({ ...prev, show: false }));
                        // Si el usuario cancela, cerrar sesión inmediatamente
                        router.post(route('logout'), {}, {
                            onSuccess: () => {
                                router.visit(route('login'), {
                                    data: {
                                        status: 'Sesión cerrada por inactividad.'
                                    }
                                });
                            }
                        });
                    },
                });
            }, warningTime);

            // Timer principal de expiración
            timeoutRef.current = setTimeout(() => {
                // La sesión ha expirado
                if (onSessionExpired) {
                    onSessionExpired();
                }

                // Cerrar sesión automáticamente
                router.post(route('logout'), {}, {
                    onSuccess: () => {
                        router.visit(route('login'), {
                            data: {
                                status: 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.'
                            }
                        });
                    },
                    onError: () => {
                        // Si falla el logout, redirigir de todas formas
                        router.visit(route('login'), {
                            data: {
                                status: 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.'
                            }
                        });
                    }
                });
            }, timeoutMs);
        };

        // Eventos que indican actividad del usuario
        const activityEvents = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click'
        ];

        // Agregar listeners de actividad
        const handleActivity = () => {
            // Solo resetear si ha pasado al menos 1 minuto desde la última actividad
            // para evitar resetear constantemente
            if (Date.now() - lastActivityRef.current > 60000) {
                resetTimer();
            }
        };

        activityEvents.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        // Inicializar el timer
        resetTimer();

        // Limpiar al desmontar
        return () => {
            activityEvents.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current);
            }
        };
    }, [auth?.user, timeoutMinutes, onSessionExpired]);

    return { sessionWarning };
}

