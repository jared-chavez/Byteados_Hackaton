import { Head, Link, router } from '@inertiajs/react';

export default function OrderHistory({ orders }) {
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

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <Head title="Historial de Órdenes" />
            
            <h1>Historial de Órdenes - Testing</h1>

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
                    Ir al Menú
                </button>
                <button
                    onClick={() => router.visit(route('dashboard'))}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Dashboard
                </button>
            </div>

            {!orders || orders.data.length === 0 ? (
                <div style={{
                    border: '1px solid #ddd',
                    padding: '40px',
                    borderRadius: '5px',
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa'
                }}>
                    <p style={{ fontSize: '18px', color: '#6c757d' }}>No tienes órdenes registradas</p>
                    <button
                        onClick={() => router.visit(route('menu.index'))}
                        style={{
                            marginTop: '20px',
                            padding: '12px 30px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Ver Menú
                    </button>
                </div>
            ) : (
                <div>
                    {orders.data.map(order => (
                        <div
                            key={order.id}
                            style={{
                                border: '2px solid #ddd',
                                padding: '20px',
                                marginBottom: '20px',
                                borderRadius: '5px',
                                backgroundColor: '#fff'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div>
                                    <h2 style={{ margin: 0, color: '#333' }}>Orden #{order.order_number}</h2>
                                    <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                                        Fecha: {new Date(order.created_at).toLocaleString('es-MX')}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        padding: '5px 15px',
                                        borderRadius: '20px',
                                        backgroundColor: getStatusColor(order.status),
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    }}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <p><strong>Método de Pago:</strong> {getPaymentMethodText(order.payment_method)}</p>
                                <p><strong>Estado de Pago:</strong> {getPaymentStatusText(order.payment_status)}</p>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <h3 style={{ marginBottom: '10px' }}>Items:</h3>
                                {order.items && order.items.map(item => (
                                    <div
                                        key={item.id}
                                        style={{
                                            border: '1px solid #eee',
                                            padding: '10px',
                                            marginBottom: '8px',
                                            borderRadius: '3px',
                                            backgroundColor: '#f8f9fa'
                                        }}
                                    >
                                        <p style={{ margin: '5px 0' }}>
                                            <strong>{item.product_name || 'Producto'}</strong> - 
                                            Cantidad: {item.quantity} x ${parseFloat(item.price || 0).toFixed(2)} = ${parseFloat(item.subtotal || 0).toFixed(2)}
                                        </p>
                                        {item.special_instructions && (
                                            <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                                                <em>Instrucciones: {item.special_instructions}</em>
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                borderTop: '2px solid #007bff',
                                paddingTop: '15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <p style={{ margin: '5px 0' }}><strong>Subtotal:</strong> ${parseFloat(order.subtotal || 0).toFixed(2)}</p>
                                    <p style={{ margin: '5px 0' }}><strong>IVA (16%):</strong> ${parseFloat(order.tax || 0).toFixed(2)}</p>
                                    <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>
                                        <strong>Total:</strong> ${parseFloat(order.total || 0).toFixed(2)}
                                    </p>
                                </div>
                                <Link
                                    href={route('order.confirmation', order.id)}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '5px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Ver Detalles
                                </Link>
                            </div>

                            {order.notes && (
                                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '3px' }}>
                                    <p style={{ margin: 0, fontSize: '14px' }}>
                                        <strong>Notas:</strong> {order.notes}
                                    </p>
                                </div>
                            )}

                            {order.completed_at && (
                                <p style={{ marginTop: '10px', fontSize: '12px', color: '#28a745' }}>
                                    ✓ Completada el {new Date(order.completed_at).toLocaleString('es-MX')}
                                </p>
                            )}
                        </div>
                    ))}

                    {/* Paginación */}
                    {orders.links && (
                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            {orders.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.visit(link.url)}
                                    disabled={!link.url}
                                    style={{
                                        padding: '8px 15px',
                                        backgroundColor: link.active ? '#007bff' : '#fff',
                                        color: link.active ? 'white' : '#007bff',
                                        border: '1px solid #007bff',
                                        borderRadius: '5px',
                                        cursor: link.url ? 'pointer' : 'not-allowed',
                                        opacity: link.url ? 1 : 0.5
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

