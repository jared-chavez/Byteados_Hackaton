import { useState, useEffect } from 'react';
import Modal from './Modal';

/**
 * Hook para usar el modal de confirmación de forma simple
 * 
 * @returns {Object} { showConfirm, confirm }
 *   - showConfirm: función para mostrar el modal de confirmación
 *   - confirm: estado del modal (objeto con show, title, message, onConfirm, onCancel)
 */
export function useConfirmModal() {
    const [confirm, setConfirm] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null,
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        variant: 'default', // 'default', 'danger', 'warning'
    });

    const showConfirm = ({
        title,
        message,
        onConfirm,
        onCancel = null,
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        variant = 'default',
    }) => {
        setConfirm({
            show: true,
            title,
            message,
            onConfirm: () => {
                setConfirm(prev => ({ ...prev, show: false }));
                if (onConfirm) onConfirm();
            },
            onCancel: () => {
                setConfirm(prev => ({ ...prev, show: false }));
                if (onCancel) onCancel();
            },
            confirmText,
            cancelText,
            variant,
        });
    };

    return { showConfirm, confirm };
}

/**
 * Componente Modal de Confirmación
 * Diseñado para coincidir con el tema oscuro y acentos verdes del proyecto
 */
export default function ConfirmModal({ confirm, onClose }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(confirm.show);
    }, [confirm.show]);

    const handleClose = () => {
        setIsOpen(false);
        if (confirm.onCancel) {
            confirm.onCancel();
        }
        if (onClose) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (confirm.onConfirm) {
            confirm.onConfirm();
        }
    };

    const getVariantStyles = () => {
        switch (confirm.variant) {
            case 'danger':
                return {
                    icon: '⚠️',
                    confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    iconBg: 'bg-red-500/20',
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
                    iconBg: 'bg-yellow-500/20',
                };
            default:
                return {
                    icon: '❓',
                    confirmButton: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
                    iconBg: 'bg-green-500/20',
                };
        }
    };

    const variantStyles = getVariantStyles();

    return (
        <Modal show={isOpen} onClose={handleClose} maxWidth="md">
            <div className="p-6">
                {/* Icono y título */}
                <div className="flex items-start gap-4 mb-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${variantStyles.iconBg} flex items-center justify-center text-2xl`}>
                        {variantStyles.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {confirm.title || 'Confirmar acción'}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {confirm.message || '¿Estás seguro de realizar esta acción?'}
                        </p>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-700">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        {confirm.cancelText || 'Cancelar'}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${variantStyles.confirmButton}`}
                    >
                        {confirm.confirmText || 'Confirmar'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

