import { Head, router, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import LazyImage from '@/Components/LazyImage';

export default function Checkout({ cart, subtotal, tax, total }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        payment_method: 'card',
        card_number: '',
        card_expiry: '',
        card_expiry_month: '',
        card_expiry_year: '',
        card_cvv: '',
        notes: '',
    });

    // Transformar datos antes de enviar
    transform((data) => {
        if (data.card_expiry) {
            const expiryParts = data.card_expiry.split('/');
            return {
                ...data,
                card_expiry_month: expiryParts[0] || '',
                card_expiry_year: expiryParts[1] ? '20' + expiryParts[1] : '',
            };
        }
        return data;
    });

    const [validationErrors, setValidationErrors] = useState({
        card_number: '',
        card_expiry: '',
        card_cvv: '',
    });

    // Detectar tipo de tarjeta basado en número de dígitos y primer dígito
    const detectCardType = (cardNumber) => {
        const cleaned = cardNumber.replace(/\s/g, '');
        const firstDigit = cleaned[0];
        const length = cleaned.length;

        if (length === 0) return null;
        
        if (firstDigit === '4' && length === 16) return 'Visa';
        if (firstDigit === '5' && length === 16) return 'Mastercard';
        if (firstDigit === '3' && (length === 15 || length === 16)) return 'Amex';
        
        return null;
    };

    // Validar número de tarjeta (solo formato básico, sin validar tarjeta real)
    const validateCardNumber = (cardNumber) => {
        const cleaned = cardNumber.replace(/\s/g, '');
        
        if (!cleaned) {
            setValidationErrors(prev => ({ 
                ...prev, 
                card_number: 'El número de tarjeta es requerido' 
            }));
            return false;
        }

        if (cleaned.length < 13) {
            setValidationErrors(prev => ({ 
                ...prev, 
                card_number: 'El número de tarjeta debe tener al menos 13 dígitos' 
            }));
            return false;
        }

        if (cleaned.length > 16) {
            setValidationErrors(prev => ({ 
                ...prev, 
                card_number: 'El número de tarjeta no puede tener más de 16 dígitos' 
            }));
            return false;
        }

        // Validación básica: solo verificar longitud (13-16 dígitos)
        // No validamos que sea una tarjeta real ya que no tenemos integración de pago
        setValidationErrors(prev => ({ ...prev, card_number: '' }));
        return true;
    };

    // Validar fecha de expiración MM/YY
    const validateExpiry = (expiry) => {
        if (!expiry) {
            setValidationErrors(prev => ({ ...prev, card_expiry: '' }));
            return true;
        }

        const parts = expiry.split('/');
        if (parts.length !== 2) {
            setValidationErrors(prev => ({ 
                ...prev, 
                card_expiry: 'Formato inválido. Use MM/YY' 
            }));
            return false;
        }

        const month = parseInt(parts[0]);
        const year = parseInt('20' + parts[1]);

        if (isNaN(month) || isNaN(year)) {
            setValidationErrors(prev => ({ 
                ...prev, 
                card_expiry: 'Mes y año deben ser números válidos' 
            }));
            return false;
        }

        if (month < 1 || month > 12) {
            setValidationErrors(prev => ({ 
                ...prev, 
                card_expiry: 'El mes debe estar entre 01 y 12' 
            }));
            return false;
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            setValidationErrors(prev => ({ 
                ...prev, 
                card_expiry: 'La fecha de expiración no puede ser anterior a la fecha actual' 
            }));
            return false;
        }

        setValidationErrors(prev => ({ ...prev, card_expiry: '' }));
        return true;
    };

    // Validar CVV
    const validateCVV = (cvv) => {
        if (!cvv) {
            setValidationErrors(prev => ({ ...prev, card_cvv: '' }));
            return true;
        }

        if (cvv.length < 3) {
            setValidationErrors(prev => ({ 
                ...prev, 
                card_cvv: 'El CVV debe tener al menos 3 dígitos' 
            }));
            return false;
        }

        if (cvv.length > 4) {
            setValidationErrors(prev => ({ 
                ...prev, 
                card_cvv: 'El CVV no puede tener más de 4 dígitos' 
            }));
            return false;
        }

        setValidationErrors(prev => ({ ...prev, card_cvv: '' }));
        return true;
    };

    // Manejar cambio en número de tarjeta
    const handleCardNumberChange = (e) => {
        // Permitir hasta 16 dígitos (sin espacios)
        const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16);
        setData('card_number', value);
        validateCardNumber(value);
    };

    // Manejar cambio en fecha de expiración
    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        // Limitar a 4 dígitos
        if (value.length > 4) {
            value = value.slice(0, 4);
        }

        // Formatear como MM/YY
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }

        setData('card_expiry', value);
        validateExpiry(value);
    };

    // Manejar cambio en CVV
    const handleCVVChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setData('card_cvv', value);
        validateCVV(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar todos los campos antes de enviar
        const isCardNumberValid = validateCardNumber(data.card_number);
        const isExpiryValid = validateExpiry(data.card_expiry);
        const isCVVValid = validateCVV(data.card_cvv);

        if (!isCardNumberValid || !isExpiryValid || !isCVVValid) {
            toast.error('Por favor corrige los errores en el formulario');
            return;
        }

        post(route('order.store'), {
            onSuccess: () => {
                toast.success('Orden creada exitosamente');
            },
            onError: (errors) => {
                if (errors.order) {
                    toast.error(errors.order);
                } else if (errors.auth) {
                    toast.error(errors.auth);
                } else {
                    toast.error('Error al crear la orden');
                }
            }
        });
    };

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-100" role="main" aria-label="Checkout">
                <Head title="Checkout" />
                <div className="text-center" role="status" aria-live="polite">
                    <h1 className="text-2xl font-bold mb-4">El carrito está vacío</h1>
                    <button
                        onClick={() => router.visit(route('menu.index'))}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Ir al menú para agregar productos"
                    >
                        Ir al Menú
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex" role="main" aria-label="Proceso de pago">
            <Head title="Checkout" />
            
            {/* Left side - Order Summary with Image Background (Hidden on mobile) */}
            <aside className="hidden lg:flex lg:w-1/2 bg-gray-100 relative overflow-hidden" role="complementary" aria-label="Resumen del pedido">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent z-10"></div>
                <LazyImage
                    src="/images/cafeteria1.png"
                    alt="Cafetería"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-8">
                    <div>
                        <button
                            onClick={() => router.visit(route('cart.index'))}
                            className="mb-6 text-white hover:text-gray-200 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white rounded"
                            aria-label="Volver al carrito de compras"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver al Carrito
                        </button>
                        <h2 className="text-3xl font-bold text-white mb-4">Resumen del Pedido</h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20" role="region" aria-label="Detalles del pedido">
                        <ul className="space-y-4 mb-6" role="list" aria-label="Lista de productos">
                            {cart.items.map(item => (
                                <li key={item.id} className="flex justify-between items-center text-white" role="listitem">
                                    <div>
                                        <p className="font-semibold">{item.product?.name || 'Producto'}</p>
                                        <p className="text-sm text-gray-200" aria-label={`Cantidad: ${item.quantity}, Precio unitario: $${parseFloat(item.price || 0).toFixed(2)}`}>
                                            {item.quantity} x ${parseFloat(item.price || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="font-semibold" aria-label={`Subtotal: $${(item.quantity * parseFloat(item.price || 0)).toFixed(2)}`}>
                                        ${(item.quantity * parseFloat(item.price || 0)).toFixed(2)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        
                        <dl className="border-t border-white/20 pt-4 space-y-2" role="list" aria-label="Resumen de precios">
                            <div className="flex justify-between text-white" role="listitem">
                                <dt>Subtotal:</dt>
                                <dd aria-label={`Subtotal: $${subtotal.toFixed(2)}`}>${subtotal.toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between text-white" role="listitem">
                                <dt>IVA (16%):</dt>
                                <dd aria-label={`IVA 16%: $${tax.toFixed(2)}`}>${tax.toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between text-white text-xl font-bold pt-2 border-t border-white/20" role="listitem">
                                <dt>Total:</dt>
                                <dd aria-label={`Total a pagar: $${total.toFixed(2)}`}>${total.toFixed(2)}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </aside>

            {/* Right side - Payment Form */}
            <section className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-8 overflow-y-auto" aria-labelledby="payment-form-heading">
                <div className="w-full max-w-md">
                    {/* Payment Card Container */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        {/* Header */}
                        <header className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h1 id="payment-form-heading" className="text-2xl font-semibold text-gray-800">Pagar Factura</h1>
                                <LazyImage
                                    src="/images/Paypal-Logo.png"
                                    alt="PayPal"
                                    className="h-12 w-auto object-contain"
                                    aria-hidden="true"
                                />
                            </div>
                            
                            {/* Accepted Cards */}
                            <div className="flex items-center justify-center gap-3 mb-6" role="list" aria-label="Tarjetas aceptadas">
                                <LazyImage
                                    src="/images/Visa_logo.png"
                                    alt="Visa"
                                    className="h-4 w-auto object-contain"
                                    role="listitem"
                                    aria-label="Tarjeta Visa aceptada"
                                />
                                <LazyImage
                                    src="/images/mastercard.webp"
                                    alt="Mastercard"
                                    className="h-4 w-auto object-contain"
                                    role="listitem"
                                    aria-label="Tarjeta Mastercard aceptada"
                                />
                            </div>

                            {/* Payment Amount */}
                            <div className="text-center">
                                <div className="block text-xs text-gray-500 mb-1">Monto a pagar</div>
                                <div className="text-3xl font-bold text-gray-900" role="status" aria-label={`Monto total a pagar: $${total.toFixed(2)}`}>
                                    ${total.toFixed(2)}
                                </div>
                            </div>
                        </header>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-label="Formulario de pago con tarjeta">
                            {/* Card Number */}
                            <div>
                                <label htmlFor="card_number" className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de tarjeta <span className="text-red-400" aria-label="requerido">*</span>
                                </label>
                                <input
                                    id="card_number"
                                    name="card_number"
                                    type="text"
                                    value={data.card_number ? data.card_number.match(/.{1,4}/g)?.join(' ') || data.card_number : ''}
                                    onChange={handleCardNumberChange}
                                    onBlur={() => validateCardNumber(data.card_number)}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    required
                                    aria-required="true"
                                    aria-invalid={!!validationErrors.card_number}
                                    aria-describedby={validationErrors.card_number ? "card_number-error" : data.card_number && detectCardType(data.card_number) ? "card_number-type" : undefined}
                                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition ${
                                        validationErrors.card_number 
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                                {validationErrors.card_number && (
                                    <p id="card_number-error" className="text-red-600 text-xs mt-1" role="alert" aria-live="polite">
                                        {validationErrors.card_number}
                                    </p>
                                )}
                                {data.card_number && detectCardType(data.card_number) && !validationErrors.card_number && (
                                    <p id="card_number-type" className="text-green-600 text-xs mt-1" role="status">
                                        Tarjeta detectada: {detectCardType(data.card_number)}
                                    </p>
                                )}
                            </div>

                            {/* Expiry and CVV */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="card_expiry" className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de vencimiento <span className="text-red-400" aria-label="requerido">*</span>
                                    </label>
                                    <input
                                        id="card_expiry"
                                        name="card_expiry"
                                        type="text"
                                        value={data.card_expiry}
                                        onChange={handleExpiryChange}
                                        onBlur={() => validateExpiry(data.card_expiry)}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!validationErrors.card_expiry}
                                        aria-describedby={validationErrors.card_expiry ? "card_expiry-error" : undefined}
                                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition ${
                                            validationErrors.card_expiry 
                                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {validationErrors.card_expiry && (
                                        <p id="card_expiry-error" className="text-red-600 text-xs mt-1" role="alert" aria-live="polite">
                                            {validationErrors.card_expiry}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="card_cvv" className="block text-sm font-medium text-gray-700 mb-2">
                                        Código de seguridad <span className="text-red-400" aria-label="requerido">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="card_cvv"
                                            name="card_cvv"
                                            type="text"
                                            value={data.card_cvv}
                                            onChange={handleCVVChange}
                                            onBlur={() => validateCVV(data.card_cvv)}
                                            placeholder="123"
                                            maxLength="4"
                                            required
                                            aria-required="true"
                                            aria-invalid={!!validationErrors.card_cvv}
                                            aria-describedby={validationErrors.card_cvv ? "card_cvv-error" : "card_cvv-help"}
                                            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition ${
                                                validationErrors.card_cvv 
                                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-gray-400 text-gray-500 text-xs hover:bg-gray-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            aria-label="Información sobre el código de seguridad CVV"
                                            aria-describedby="card_cvv-help-text"
                                        >
                                            ?
                                        </button>
                                        <span id="card_cvv-help-text" className="sr-only">
                                            Código de seguridad de 3 o 4 dígitos ubicado en el reverso de tu tarjeta
                                        </span>
                                    </div>
                                    {validationErrors.card_cvv && (
                                        <p id="card_cvv-error" className="text-red-600 text-xs mt-1" role="alert" aria-live="polite">
                                            {validationErrors.card_cvv}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                    Notas adicionales <span className="text-gray-500 text-xs">(opcional)</span>
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                                    rows="3"
                                    placeholder="Instrucciones especiales para tu pedido..."
                                    aria-label="Notas adicionales para el pedido"
                                />
                            </div>

                            {errors.order && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm" role="alert" aria-live="assertive">
                                    {errors.order}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={
                                    processing || 
                                    !!validationErrors.card_number || 
                                    !!validationErrors.card_expiry || 
                                    !!validationErrors.card_cvv || 
                                    !data.card_number || 
                                    !data.card_expiry || 
                                    !data.card_cvv
                                }
                                aria-busy={processing}
                                aria-label={processing ? `Procesando pago de $${total.toFixed(2)}, por favor espera` : `Pagar $${total.toFixed(2)}`}
                                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-md transition duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                {processing ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
                            </button>

                            {/* Security Message */}
                            <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1" role="note" aria-label="Información de seguridad">
                                <FaLock className="w-3 h-3" aria-hidden="true" />
                                <span>Tu información está protegida y encriptada</span>
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

