import { Head, Link, router, usePage } from '@inertiajs/react';
import { FaClipboardList } from 'react-icons/fa';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../css/dashboard.css';

export default function OrderHistory({ orders }) {
    const { auth } = usePage().props;
    const getStatusColor = (status) => {
        const colors = {
            'pending': '#ffc107',
            'confirmed': '#17a2b8',
            'preparing': '#007bff',
            'ready': '#28a745',
            'completed': '#28a745',
            'cancelled': '#dc3545',
        };
        return colors[status] || '#6c757d';
    };

    const getStatusText = (status) => {
        const texts = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmada',
            'preparing': 'Preparando',
            'ready': 'Lista',
            'completed': 'Completada',
            'cancelled': 'Cancelada',
        };
        return texts[status] || status;
    };

    const getPaymentStatusText = (status) => {
        const texts = {
            'pending': 'Pendiente',
            'paid': 'Pagado',
            'refunded': 'Reembolsado',
        };
        return texts[status] || status;
    };

    const getPaymentMethodText = (method) => {
        const methods = {
            'paypal': 'PayPal',
            'cash': 'Efectivo',
            'card': 'Tarjeta',
        };
        return methods[method] || method || 'No especificado';
    };

    const getStatusClass = (status) => {
        const classes = {
            'pending': 'order-status-pending',
            'confirmed': 'order-status-confirmed',
            'preparing': 'order-status-preparing',
            'ready': 'order-status-ready',
            'completed': 'order-status-completed',
            'cancelled': 'order-status-cancelled',
        };
        return classes[status] || 'order-status-pending';
    };

    const OrdersContent = () => (
        <main className="orders-page" role="main" aria-label="Historial de órdenes">
            <div className="orders-container">
                <header className="orders-header" role="banner">
                    <h1 className="orders-title">Mis Órdenes</h1>
                    <p className="orders-subtitle">Revisa el historial y estado de tus pedidos</p>
                    {orders && orders.data && orders.data.length > 0 && (
                        <p className="sr-only">
                            Tienes {orders.data.length} orden{orders.data.length !== 1 ? 'es' : ''} en tu historial
                        </p>
                    )}
                </header>

                {!orders || orders.data.length === 0 ? (
                    <div className="orders-empty" role="status" aria-live="polite">
                        <div className="orders-empty-icon" aria-hidden="true">
                            <FaClipboardList size={48} />
                        </div>
                        <p className="orders-empty-text">No tienes órdenes registradas</p>
                        <button
                            onClick={() => router.visit(route('menu.index'))}
                            className="dashboard-btn dashboard-btn-primary focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                            aria-label="Ir al menú para realizar un pedido"
                        >
                            Ver Menú
                        </button>
                    </div>
                ) : (
                    <>
                        <section className="orders-list" aria-label="Lista de órdenes" role="list">
                            {orders.data.map(order => {
                                const orderDate = new Date(order.created_at).toLocaleString('es-MX', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                                const completedDate = order.completed_at 
                                    ? new Date(order.completed_at).toLocaleString('es-MX')
                                    : null;
                                
                                return (
                                    <article 
                                        key={order.id} 
                                        className="order-card"
                                        role="listitem"
                                        aria-labelledby={`order-title-${order.id}`}
                                    >
                                        <header className="order-header">
                                            <div className="order-info">
                                                <h3 id={`order-title-${order.id}`}>
                                                    Orden #{order.order_number}
                                                </h3>
                                                <p className="order-info-date" aria-label={`Fecha de creación: ${orderDate}`}>
                                                    {orderDate}
                                                </p>
                                            </div>
                                            <span 
                                                className={`order-status-badge ${getStatusClass(order.status)}`}
                                                role="status"
                                                aria-label={`Estado de la orden: ${getStatusText(order.status)}`}
                                            >
                                                {getStatusText(order.status)}
                                            </span>
                                        </header>

                                        <dl className="order-details" role="list">
                                            <div className="order-detail-item" role="listitem">
                                                <dt className="order-detail-label">Método de Pago</dt>
                                                <dd className="order-detail-value" aria-label={`Método de pago: ${getPaymentMethodText(order.payment_method)}`}>
                                                    {getPaymentMethodText(order.payment_method)}
                                                </dd>
                                            </div>
                                            <div className="order-detail-item" role="listitem">
                                                <dt className="order-detail-label">Estado de Pago</dt>
                                                <dd 
                                                    className="order-detail-value"
                                                    role="status"
                                                    aria-label={`Estado de pago: ${getPaymentStatusText(order.payment_status)}`}
                                                >
                                                    {getPaymentStatusText(order.payment_status)}
                                                </dd>
                                            </div>
                                        </dl>

                                        <section className="order-items" aria-labelledby={`order-items-title-${order.id}`}>
                                            <h4 id={`order-items-title-${order.id}`} className="order-items-title">
                                                Items
                                                <span className="sr-only">
                                                    {order.items ? ` - ${order.items.length} producto${order.items.length !== 1 ? 's' : ''}` : ''}
                                                </span>
                                            </h4>
                                            <ul className="order-items-list" role="list" aria-label="Lista de productos en la orden">
                                                {order.items && order.items.map(item => (
                                                    <li key={item.id} className="order-item" role="listitem">
                                                        <div className="order-item-name">
                                                            {item.product_name || 'Producto'}
                                                        </div>
                                                        <div className="order-item-details" aria-label={`Cantidad: ${item.quantity}, Precio unitario: $${parseFloat(item.price || 0).toFixed(2)}, Subtotal: $${parseFloat(item.subtotal || 0).toFixed(2)}`}>
                                                            Cantidad: {item.quantity} × ${parseFloat(item.price || 0).toFixed(2)} = ${parseFloat(item.subtotal || 0).toFixed(2)}
                                                        </div>
                                                        {item.special_instructions && (
                                                            <div className="order-item-instructions" role="note" aria-label="Instrucciones especiales">
                                                                <strong>Instrucciones:</strong> {item.special_instructions}
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>

                                        <div className="order-summary" role="region" aria-label="Resumen de la orden">
                                            <dl className="order-summary-details" role="list">
                                                <div className="order-summary-line" role="listitem">
                                                    <dt>Subtotal:</dt>
                                                    <dd aria-label={`Subtotal: $${parseFloat(order.subtotal || 0).toFixed(2)}`}>
                                                        ${parseFloat(order.subtotal || 0).toFixed(2)}
                                                    </dd>
                                                </div>
                                                <div className="order-summary-line" role="listitem">
                                                    <dt>IVA (16%):</dt>
                                                    <dd aria-label={`IVA 16%: $${parseFloat(order.tax || 0).toFixed(2)}`}>
                                                        ${parseFloat(order.tax || 0).toFixed(2)}
                                                    </dd>
                                                </div>
                                                <div className="order-summary-line" role="listitem">
                                                    <dt className="order-summary-total">Total:</dt>
                                                    <dd className="order-summary-total" aria-label={`Total a pagar: $${parseFloat(order.total || 0).toFixed(2)}`}>
                                                        ${parseFloat(order.total || 0).toFixed(2)}
                                                    </dd>
                                                </div>
                                            </dl>
                                            <Link
                                                href={route('order.confirmation', order.id)}
                                                className="dashboard-btn dashboard-btn-primary focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                                                aria-label={`Ver detalles completos de la orden ${order.order_number}`}
                                            >
                                                Ver Detalles
                                            </Link>
                                        </div>

                                        {order.notes && (
                                            <div className="order-notes" role="note" aria-label="Notas adicionales de la orden">
                                                <div className="order-notes-label">Notas:</div>
                                                <div className="order-notes-text">{order.notes}</div>
                                            </div>
                                        )}

                                        {order.completed_at && (
                                            <div className="order-completed-badge" role="status" aria-label={`Orden completada el ${completedDate}`}>
                                                <span aria-hidden="true">✓</span>
                                                <span>Completada el {completedDate}</span>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </section>

                        {/* Paginación */}
                        {orders.links && orders.links.length > 3 && (
                            <nav className="order-pagination" aria-label="Navegación de páginas">
                                <ul role="list" style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem' }}>
                                    {orders.links.map((link, index) => {
                                        const isPrevious = link.label.includes('Anterior') || link.label.includes('Previous');
                                        const isNext = link.label.includes('Siguiente') || link.label.includes('Next');
                                        const isEllipsis = link.label.includes('…') || link.label.includes('...');
                                        const pageNumber = link.label.match(/\d+/)?.[0];
                                        
                                        let ariaLabel = '';
                                        if (isPrevious) {
                                            ariaLabel = 'Ir a la página anterior';
                                        } else if (isNext) {
                                            ariaLabel = 'Ir a la página siguiente';
                                        } else if (isEllipsis) {
                                            ariaLabel = 'Más páginas';
                                        } else if (link.active) {
                                            ariaLabel = `Página actual, página ${pageNumber || link.label}`;
                                        } else {
                                            ariaLabel = `Ir a la página ${pageNumber || link.label}`;
                                        }

                                        return (
                                            <li key={index} role="listitem">
                                                <button
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    disabled={!link.url || link.active}
                                                    className={`order-pagination-btn focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black ${link.active ? 'active' : ''}`}
                                                    aria-label={ariaLabel}
                                                    aria-current={link.active ? 'page' : undefined}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </main>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Historial de Órdenes" />
            <OrdersContent />
        </AuthenticatedLayout>
    );
}

