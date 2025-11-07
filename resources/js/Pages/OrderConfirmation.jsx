import { Head, router } from '@inertiajs/react';

export default function OrderConfirmation({ order }) {
    if (!order) {
        return (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <Head title="Confirmación de Orden" />
                <h1>Orden no encontrada</h1>
                <button
                    onClick={() => router.visit('/')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Ir a Inicio
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <Head title="Confirmación de Orden" />
            
            <h1>Orden Confirmada - Testing</h1>

            <div style={{
                border: '2px solid #28a745',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px',
                backgroundColor: '#d4edda'
            }}>
                <h2 style={{ color: '#155724', marginTop: 0 }}>¡Orden Completada Exitosamente!</h2>
                <p><strong>Número de Orden:</strong> {order.order_number}</p>
                <p><strong>Estado:</strong> {order.status}</p>
                <p><strong>Método de Pago:</strong> {order.payment_method || 'No especificado'}</p>
                <p><strong>Estado de Pago:</strong> {order.payment_status}</p>
                <p style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                    Tu orden ha sido registrada en el historial y está siendo procesada.
                </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Detalles de la Orden</h2>
                {order.items && order.items.map(item => (
                    <div
                        key={item.id}
                        style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            marginBottom: '10px',
                            borderRadius: '5px'
                        }}
                    >
                        <p><strong>{item.product_name || 'Producto'}</strong></p>
                        <p>Cantidad: {item.quantity} x ${parseFloat(item.price || 0).toFixed(2)} = ${parseFloat(item.subtotal || 0).toFixed(2)}</p>
                        {item.special_instructions && (
                            <p><strong>Instrucciones:</strong> {item.special_instructions}</p>
                        )}
                    </div>
                ))}
            </div>

            <div style={{
                border: '2px solid #007bff',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                <h2>Resumen de Pago</h2>
                <p><strong>Subtotal:</strong> ${parseFloat(order.subtotal || 0).toFixed(2)}</p>
                <p><strong>IVA (16%):</strong> ${parseFloat(order.tax || 0).toFixed(2)}</p>
                <p><strong>Total:</strong> ${parseFloat(order.total || 0).toFixed(2)}</p>
            </div>

            {order.notes && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>Notas:</h3>
                    <p>{order.notes}</p>
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={() => router.visit(route('orders.index'))}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Ver Historial de Órdenes
                </button>
                <button
                    onClick={() => router.visit(route('menu.index'))}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Continuar Comprando
                </button>
                <button
                    onClick={() => router.visit('/')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Ir a Inicio
                </button>
            </div>
        </div>
    );
}

