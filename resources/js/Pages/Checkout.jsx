import { Head, router, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function Checkout({ cart, subtotal, tax, total }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'card',
        card_number: '',
        card_expiry_month: '',
        card_expiry_year: '',
        card_cvv: '',
        notes: '',
    });

    const [expiryError, setExpiryError] = useState('');

    const validateExpiry = (month, year) => {
        if (!month || !year) {
            setExpiryError('');
            return true;
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const expiryYear = parseInt(year);
        const expiryMonth = parseInt(month);

        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
            setExpiryError('La fecha de expiración no puede ser anterior a la fecha actual');
            return false;
        }

        setExpiryError('');
        return true;
    };

    const handleExpiryChange = (field, value) => {
        if (field === 'month') {
            setData('card_expiry_month', value);
            validateExpiry(value, data.card_expiry_year);
        } else {
            setData('card_expiry_year', value);
            validateExpiry(data.card_expiry_month, value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar fecha de expiración antes de enviar
        if (!validateExpiry(data.card_expiry_month, data.card_expiry_year)) {
            toast.error('Por favor corrige la fecha de expiración');
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
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <Head title="Checkout" />
                <h1>Checkout - Testing</h1>
                <p>El carrito está vacío</p>
                <button
                    onClick={() => router.visit(route('menu.index'))}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Ir al Menú
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <Head title="Checkout" />
            
            <h1>Checkout - Testing</h1>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => router.visit(route('cart.index'))}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Volver al Carrito
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h2>Resumen del Pedido</h2>
                    {cart.items.map(item => (
                        <div
                            key={item.id}
                            style={{
                                border: '1px solid #ddd',
                                padding: '10px',
                                marginBottom: '10px',
                                borderRadius: '5px'
                            }}
                        >
                            <p><strong>{item.product?.name || 'Producto'}</strong></p>
                            <p>Cantidad: {item.quantity} x ${item.price} = ${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                    ))}
                    
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                        <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
                        <p><strong>IVA (16%):</strong> ${tax.toFixed(2)}</p>
                        <p><strong>Total:</strong> ${total.toFixed(2)}</p>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '20px',
                        paddingBottom: '15px',
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ 
                                fontSize: '24px', 
                                fontWeight: 'bold',
                                color: '#0070ba'
                            }}>
                                PayPal
                            </div>
                        </div>
                        <div style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold',
                            color: '#333'
                        }}>
                            ${total.toFixed(2)} MXN
                        </div>
                    </div>

                    <h2 style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        color: '#333'
                    }}>
                        Pagar con tarjeta de débito o crédito
                    </h2>
                    
                    <p style={{ 
                        fontSize: '14px', 
                        color: '#666',
                        marginBottom: '25px'
                    }}>
                        No compartimos su información financiera con el vendedor.
                    </p>
                    
                    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                        {/* Número de tarjeta */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#333'
                            }}>
                                Número de tarjeta
                            </label>
                            <input
                                type="text"
                                value={data.card_number}
                                onChange={(e) => setData('card_number', e.target.value.replace(/\D/g, '').slice(0, 16))}
                                placeholder="1234 5678 9012 3456"
                                maxLength="16"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d0d0d0',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    backgroundColor: '#fff'
                                }}
                            />
                        </div>

                        {/* Fecha de expiración y CVV */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr',
                            gap: '15px',
                            marginBottom: '20px'
                        }}>
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333'
                                }}>
                                    Vencimiento
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <select
                                        value={data.card_expiry_month}
                                        onChange={(e) => handleExpiryChange('month', e.target.value)}
                                        required
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: '1px solid #d0d0d0',
                                            borderRadius: '4px',
                                            fontSize: '16px',
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <option value="">Mes</option>
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const month = i + 1;
                                            return (
                                                <option key={month} value={month.toString().padStart(2, '0')}>
                                                    {month.toString().padStart(2, '0')}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <select
                                        value={data.card_expiry_year}
                                        onChange={(e) => handleExpiryChange('year', e.target.value)}
                                        required
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: '1px solid #d0d0d0',
                                            borderRadius: '4px',
                                            fontSize: '16px',
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <option value="">Año</option>
                                        {Array.from({ length: 15 }, (_, i) => {
                                            const year = new Date().getFullYear() + i;
                                            return (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                {expiryError && (
                                    <p style={{ 
                                        color: '#d93025', 
                                        fontSize: '12px', 
                                        marginTop: '5px' 
                                    }}>
                                        {expiryError}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333'
                                }}>
                                    CSC
                                </label>
                                <input
                                    type="text"
                                    value={data.card_cvv}
                                    onChange={(e) => setData('card_cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="123"
                                    maxLength="4"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d0d0d0',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                        backgroundColor: '#fff'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Notas adicionales */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#333'
                            }}>
                                Notas adicionales (opcional)
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d0d0d0',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    minHeight: '80px',
                                    backgroundColor: '#fff',
                                    resize: 'vertical'
                                }}
                                placeholder="Instrucciones especiales para tu pedido..."
                            />
                        </div>

                        {errors.order && (
                            <div style={{ 
                                color: '#d93025', 
                                marginBottom: '15px',
                                padding: '10px',
                                backgroundColor: '#fce8e6',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}>
                                {errors.order}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing || !!expiryError || !data.card_number || !data.card_expiry_month || !data.card_expiry_year || !data.card_cvv}
                            style={{
                                width: '100%',
                                padding: '14px 30px',
                                backgroundColor: (processing || expiryError || !data.card_number || !data.card_expiry_month || !data.card_expiry_year || !data.card_cvv) ? '#ccc' : '#0070ba',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: (processing || expiryError || !data.card_number || !data.card_expiry_month || !data.card_expiry_year || !data.card_cvv) ? 'not-allowed' : 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                marginTop: '10px'
                            }}
                        >
                            {processing ? 'Procesando...' : 'Pagar ahora'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

