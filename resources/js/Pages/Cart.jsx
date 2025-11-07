import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function formatTimeRemaining(expiresAt) {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return 'Expirado';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function Cart({ cart: initialCart, total: initialTotal, total_items: initialTotalItems }) {
    const [cart, setCart] = useState(initialCart);
    const [quantities, setQuantities] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(null);

    useEffect(() => {
        // Siempre cargar desde la API para asegurar que tenemos los datos más recientes
        loadCart();
    }, []);

    useEffect(() => {
        // Actualizar timer cada segundo y limpiar cuando expire
        if (cart?.expires_at) {
            // Verificar si ya está expirado al cargar
            const initialTime = formatTimeRemaining(cart.expires_at);
            if (initialTime === 'Expirado') {
                handleCartExpired();
                return;
            }
            
            const interval = setInterval(() => {
                const timeRem = formatTimeRemaining(cart.expires_at);
                setTimeRemaining(timeRem);
                
                // Si el tiempo expiró, limpiar el carrito
                if (timeRem === 'Expirado') {
                    clearInterval(interval);
                    handleCartExpired();
                }
            }, 1000);
            
            // Actualizar inmediatamente
            setTimeRemaining(initialTime);
            
            return () => clearInterval(interval);
        } else {
            setTimeRemaining(null);
        }
    }, [cart?.expires_at]);

    const handleCartExpired = async () => {
        try {
            // Limpiar el carrito expirado
            await axios.delete('/api/v1/cart/clear');
            toast.warning('El carrito ha expirado y ha sido vaciado');
            
            // Recargar el carrito (estará vacío)
            await loadCart();
        } catch (error) {
            console.error('Error al limpiar carrito expirado:', error);
            // Aún así, recargar el carrito
            await loadCart();
        }
    };

    const loadCart = async () => {
        try {
            const response = await axios.get('/api/v1/cart');
            console.log('Cart API response:', response.data);
            console.log('Cart data:', response.data?.data?.cart);
            console.log('Items:', response.data?.data?.cart?.items);
            
            if (response.data.success && response.data.data && response.data.data.cart) {
                const cartData = response.data.data.cart;
                
                // Verificar que items exista y sea un array
                if (!cartData.items) {
                    cartData.items = [];
                }
                
                console.log('Setting cart with items:', cartData.items.length);
                setCart(cartData);
                
                const qtyMap = {};
                if (Array.isArray(cartData.items) && cartData.items.length > 0) {
                    cartData.items.forEach(item => {
                        qtyMap[item.id] = item.quantity;
                    });
                }
                setQuantities(qtyMap);
            } else {
                console.log('No cart data found, setting to null');
                setCart(null);
                setQuantities({});
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            console.error('Error response:', error.response);
            setCart(null);
            setQuantities({});
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await axios.put(`/api/v1/cart/items/${itemId}`, {
                quantity: parseInt(newQuantity)
            });
            setQuantities(prev => ({ ...prev, [itemId]: parseInt(newQuantity) }));
            loadCart();
            toast.success('Cantidad actualizada');
        } catch (error) {
            toast.error('Error al actualizar cantidad');
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm('¿Eliminar este producto del carrito?')) return;

        try {
            await axios.delete(`/api/v1/cart/items/${itemId}`);
            loadCart();
            toast.success('Producto eliminado del carrito');
        } catch (error) {
            toast.error('Error al eliminar producto');
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('¿Vaciar todo el carrito?')) return;

        try {
            await axios.delete('/api/v1/cart/clear');
            loadCart();
            toast.success('Carrito vaciado');
        } catch (error) {
            toast.error('Error al vaciar carrito');
        }
    };

    // Verificar si el carrito está vacío
    const isEmpty = !cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0;
    
    // Debug: mostrar estado del carrito
    console.log('Cart state:', {
        cart,
        hasCart: !!cart,
        hasItems: !!cart?.items,
        itemsIsArray: Array.isArray(cart?.items),
        itemsLength: cart?.items?.length,
        isEmpty
    });

    if (isEmpty) {
        return (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <Head title="Carrito" />
                <h1>Carrito - Testing</h1>
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
            <Head title="Carrito" />
            
            <h1>Carrito - Testing</h1>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => router.visit(route('menu.index'))}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Continuar Comprando
                </button>
                <button
                    onClick={handleClearCart}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Vaciar Carrito
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Items del Carrito</h2>
                {cart.items.map(item => (
                    <div
                        key={item.id}
                        style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            marginBottom: '10px',
                            borderRadius: '5px'
                        }}
                    >
                        <h3>{item.product?.name || 'Producto'}</h3>
                        <p><strong>Precio unitario:</strong> ${item.price}</p>
                        <p><strong>Subtotal:</strong> ${(item.quantity * item.price).toFixed(2)}</p>
                        {item.special_instructions && (
                            <p><strong>Instrucciones:</strong> {item.special_instructions}</p>
                        )}
                        
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <label>
                                Cantidad:
                                <input
                                    type="number"
                                    min="1"
                                    max={item.product?.stock || 999}
                                    value={quantities[item.id] || item.quantity}
                                    onChange={(e) => setQuantities(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 1 }))}
                                    onBlur={(e) => handleUpdateQuantity(item.id, e.target.value)}
                                    style={{
                                        marginLeft: '5px',
                                        padding: '5px',
                                        width: '60px'
                                    }}
                                />
                            </label>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                style={{
                                    padding: '8px 15px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                border: '2px solid #007bff',
                padding: '20px',
                borderRadius: '5px',
                marginTop: '20px'
            }}>
                <h2>Resumen</h2>
                {timeRemaining && (
                    <p style={{ 
                        color: timeRemaining === 'Expirado' ? '#dc3545' : '#ffc107',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                    }}>
                        <strong>Tiempo restante:</strong> {timeRemaining}
                    </p>
                )}
                <p><strong>Total de items:</strong> {cart.total_items || 0}</p>
                <p><strong>Subtotal:</strong> ${(cart.total || 0).toFixed(2)}</p>
                <p><strong>IVA (16%):</strong> ${((cart.total || 0) * 0.16).toFixed(2)}</p>
                <p><strong>Total:</strong> ${((cart.total || 0) * 1.16).toFixed(2)}</p>
                
                <button
                    onClick={() => router.visit(route('checkout.index'))}
                    style={{
                        marginTop: '15px',
                        padding: '12px 30px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Proceder al Checkout
                </button>
            </div>
        </div>
    );
}

