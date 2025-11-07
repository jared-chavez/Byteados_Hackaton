import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaShoppingCart } from 'react-icons/fa';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal, { useConfirmModal } from '@/Components/ConfirmModal';
import '../../css/dashboard.css';

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
    const { showConfirm, confirm } = useConfirmModal();

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
        showConfirm({
            title: 'Eliminar producto',
            message: '¿Estás seguro de que deseas eliminar este producto del carrito?',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await axios.delete(`/api/v1/cart/items/${itemId}`);
                    loadCart();
                    toast.success('Producto eliminado del carrito');
                } catch (error) {
                    toast.error('Error al eliminar producto');
                }
            },
        });
    };

    const handleClearCart = async () => {
        showConfirm({
            title: 'Vaciar carrito',
            message: '¿Estás seguro de que deseas vaciar todo el carrito? Esta acción no se puede deshacer.',
            confirmText: 'Vaciar carrito',
            cancelText: 'Cancelar',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await axios.delete('/api/v1/cart/clear');
                    loadCart();
                    toast.success('Carrito vaciado');
                } catch (error) {
                    toast.error('Error al vaciar carrito');
                }
            },
        });
    };

    // Verificar si el carrito está vacío
    const isEmpty = !cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0;
    
    const subtotal = cart?.total || 0;
    const tax = subtotal * 0.16;
    const total = subtotal + tax;
    const totalItems = cart?.total_items || 0;

    const handleQuantityDecrease = (itemId, currentQty) => {
        if (currentQty > 1) {
            handleUpdateQuantity(itemId, currentQty - 1);
        }
    };

    const handleQuantityIncrease = (itemId, currentQty, maxStock) => {
        if (currentQty < maxStock) {
            handleUpdateQuantity(itemId, currentQty + 1);
        }
    };

    const CartEmptyState = () => (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-empty">
                        <div className="cart-empty-icon" aria-hidden="true">
                            <FaShoppingCart size={48} />
                    </div>
                    <h2 className="cart-empty-title">Tu Carrito Está Vacío</h2>
                    <p className="cart-empty-text">
                        Parece que aún no has agregado productos a tu carrito. 
                        Explora nuestro menú y descubre nuestras deliciosas opciones.
                    </p>
                <button
                    onClick={() => router.visit(route('menu.index'))}
                        className="dashboard-btn dashboard-btn-primary"
                    >
                        Explorar Menú
                </button>
                </div>
            </div>
            </div>
        );

    const CartWithItems = () => (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h1 className="cart-title">Mi Carrito</h1>
                    <div className="cart-actions-top">
                <button
                    onClick={() => router.visit(route('menu.index'))}
                            className="dashboard-btn dashboard-btn-secondary"
                >
                    Continuar Comprando
                </button>
                <button
                    onClick={handleClearCart}
                            className="dashboard-btn dashboard-btn-danger"
                >
                    Vaciar Carrito
                </button>
            </div>
                </div>

                <div className="cart-content">
                    <div className="cart-items-section">
                        <div className="cart-items-header">
                            <h2 className="cart-items-title">Items ({totalItems})</h2>
                        </div>

                        {cart.items.map(item => {
                            const currentQty = quantities[item.id] || item.quantity;
                            const itemSubtotal = currentQty * parseFloat(item.price || 0);
                            const maxStock = item.product?.stock || 999;

                            return (
                                <div key={item.id} className="cart-item-card">
                                    <div className="cart-item-header">
                                        <h3 className="cart-item-name">
                                            {item.product?.name || 'Producto'}
                                        </h3>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="cart-item-remove"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    <div className="cart-item-info">
                                        <div className="cart-item-info-item">
                                            <div className="cart-item-info-label">Precio Unitario</div>
                                            <div className="cart-item-price">
                                                ${parseFloat(item.price || 0).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="cart-item-info-item">
                                            <div className="cart-item-info-label">Categoría</div>
                                            <div className="cart-item-info-value">
                                                {item.product?.category?.name || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="cart-item-info-item">
                                            <div className="cart-item-info-label">Stock Disponible</div>
                                            <div className="cart-item-info-value">
                                                {item.product?.stock || 0} unidades
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="cart-item-quantity">
                                            <span className="cart-item-quantity-label">Cantidad:</span>
                                            <div className="cart-item-quantity-controls">
                                                <button
                                                    onClick={() => handleQuantityDecrease(item.id, currentQty)}
                                                    className="cart-item-quantity-btn"
                                                    disabled={currentQty <= 1}
                                                >
                                                    −
                                                </button>
                                <input
                                    type="number"
                                    min="1"
                                                    max={maxStock}
                                                    value={currentQty}
                                    onChange={(e) => setQuantities(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 1 }))}
                                    onBlur={(e) => handleUpdateQuantity(item.id, e.target.value)}
                                                    className="cart-item-quantity-input"
                                                />
                            <button
                                                    onClick={() => handleQuantityIncrease(item.id, currentQty, maxStock)}
                                                    className="cart-item-quantity-btn"
                                                    disabled={currentQty >= maxStock}
                                                >
                                                    +
                            </button>
                        </div>
                    </div>
                                        <div className="cart-item-subtotal">
                                            ${itemSubtotal.toFixed(2)}
                                        </div>
            </div>

                                    {item.special_instructions && (
                                        <div className="cart-item-instructions">
                                            <div className="cart-item-instructions-label">Instrucciones Especiales</div>
                                            <div className="cart-item-instructions-text">
                                                {item.special_instructions}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <div className="cart-summary-card">
                            <h2 className="cart-summary-title">Resumen</h2>

                {timeRemaining && (
                                <div className={`cart-summary-timer ${timeRemaining === 'Expirado' ? 'expired' : ''}`}>
                                    <div className="cart-summary-timer-label">Tiempo Restante</div>
                                    <div className="cart-summary-timer-value">{timeRemaining}</div>
                                </div>
                            )}

                            <div className="cart-summary-details">
                                <div className="cart-summary-line">
                                    <span className="cart-summary-label">Items</span>
                                    <span className="cart-summary-value">{totalItems}</span>
                                </div>
                                <div className="cart-summary-line">
                                    <span className="cart-summary-label">Subtotal</span>
                                    <span className="cart-summary-value">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="cart-summary-line">
                                    <span className="cart-summary-label">IVA (16%)</span>
                                    <span className="cart-summary-value">${tax.toFixed(2)}</span>
                                </div>
                                <div className="cart-summary-line total">
                                    <span className="cart-summary-label">Total</span>
                                    <span className="cart-summary-value">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="cart-summary-actions">
                <button
                    onClick={() => router.visit(route('checkout.index'))}
                                    className="cart-summary-checkout"
                                    disabled={isEmpty || timeRemaining === 'Expirado'}
                                >
                                    <span>Proceder al Checkout</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const { auth } = usePage().props;

    if (isEmpty) {
        return (
            <>
                <Head title="Carrito" />
                <ConfirmModal confirm={confirm} />
                {auth?.user ? (
                    <AuthenticatedLayout>
                        <CartEmptyState />
                    </AuthenticatedLayout>
                ) : (
                    <CartEmptyState />
                )}
            </>
        );
    }

    return (
        <>
            <Head title="Carrito" />
            <ConfirmModal confirm={confirm} />
            {auth?.user ? (
                <AuthenticatedLayout>
                    <CartWithItems />
                </AuthenticatedLayout>
            ) : (
                <CartWithItems />
            )}
        </>
    );
}

