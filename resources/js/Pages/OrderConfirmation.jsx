import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function OrderConfirmation({ order }) {
    const { auth } = usePage().props;

    if (!order) {
        return (
            <AuthenticatedLayout>
                <Head title="Confirmación de Orden" />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8" role="main" aria-label="Confirmación de orden">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center" role="alert">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Orden no encontrada</h2>
                        <button
                            onClick={() => router.visit('/')}
                            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="Ir a la página de inicio"
                        >
                            Ir a Inicio
                        </button>
                    </div>
                </main>
            </AuthenticatedLayout>
        );
    }

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

    const getPaymentMethodText = (method) => {
        const methods = {
            'paypal': 'PayPal',
            'cash': 'Efectivo',
            'card': 'Tarjeta',
        };
        return methods[method] || method || 'No especificado';
    };

    const getPaymentStatusText = (status) => {
        const texts = {
            'pending': 'Pendiente',
            'paid': 'Pagado',
            'refunded': 'Reembolsado',
        };
        return texts[status] || status;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Confirmación de Orden" />
            <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" role="main" aria-label="Confirmación de compra exitosa">
                <div className="max-w-3xl mx-auto">
                    {/* Success Header Card */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6 text-center" role="status" aria-live="polite" aria-atomic="true">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Compra Exitosa!</h1>
                            <p className="text-gray-600">
                                Tu orden ha sido confirmada y está siendo procesada
                            </p>
                        </div>

                        {/* Order Number Badge */}
                        <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200" role="region" aria-label="Número de orden">
                            <span className="text-sm text-gray-600">Número de Orden:</span>
                            <span className="text-lg font-bold text-gray-900" aria-label={`Número de orden: ${order.order_number}`}>
                                #{order.order_number}
                            </span>
                        </div>
                    </section>

                    {/* Order Details Card */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6" aria-labelledby="order-details-heading">
                        <h2 id="order-details-heading" className="text-xl font-semibold text-gray-900 mb-6">Detalles de la Orden</h2>
                        
                        {/* Order Info Grid */}
                        <dl className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200" role="list" aria-label="Información de la orden">
                            <div role="listitem">
                                <dt className="text-sm text-gray-500 mb-1">Estado</dt>
                                <dd className="text-base font-semibold text-gray-900" aria-label={`Estado de la orden: ${getStatusText(order.status)}`}>
                                    {getStatusText(order.status)}
                                </dd>
                            </div>
                            <div role="listitem">
                                <dt className="text-sm text-gray-500 mb-1">Método de Pago</dt>
                                <dd className="text-base font-semibold text-gray-900" aria-label={`Método de pago: ${getPaymentMethodText(order.payment_method)}`}>
                                    {getPaymentMethodText(order.payment_method)}
                                </dd>
                            </div>
                            <div role="listitem">
                                <dt className="text-sm text-gray-500 mb-1">Estado de Pago</dt>
                                <dd className="text-base font-semibold text-gray-900" role="status" aria-label={`Estado de pago: ${getPaymentStatusText(order.payment_status)}`}>
                                    {getPaymentStatusText(order.payment_status)}
                                </dd>
                            </div>
                            <div role="listitem">
                                <dt className="text-sm text-gray-500 mb-1">Fecha</dt>
                                <dd className="text-base font-semibold text-gray-900" aria-label={`Fecha de la orden: ${new Date(order.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}`}>
                                    {new Date(order.created_at).toLocaleDateString('es-MX', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </dd>
                            </div>
                        </dl>

                        {/* Items List */}
                        <div className="space-y-4" aria-labelledby="products-heading">
                            <h3 id="products-heading" className="text-lg font-semibold text-gray-900 mb-4">
                                Productos
                                <span className="sr-only">
                                    {order.items ? ` - ${order.items.length} producto${order.items.length !== 1 ? 's' : ''}` : ''}
                                </span>
                            </h3>
                            <ul role="list" aria-label="Lista de productos en la orden">
                                {order.items && order.items.map(item => (
                                    <li key={item.id} className="flex justify-between items-start py-4 border-b border-gray-100 last:border-0" role="listitem">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 mb-1">
                                                {item.product_name || 'Producto'}
                                            </div>
                                            <div className="text-sm text-gray-600" aria-label={`Cantidad: ${item.quantity}, Precio unitario: $${parseFloat(item.price || 0).toFixed(2)}`}>
                                                Cantidad: {item.quantity} × ${parseFloat(item.price || 0).toFixed(2)}
                                            </div>
                                            {item.special_instructions && (
                                                <div className="text-xs text-gray-500 mt-2 italic" role="note" aria-label="Instrucciones especiales">
                                                    {item.special_instructions}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-lg font-semibold text-gray-900 ml-4" aria-label={`Subtotal: $${parseFloat(item.subtotal || 0).toFixed(2)}`}>
                                            ${parseFloat(item.subtotal || 0).toFixed(2)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Payment Summary Card */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6" aria-labelledby="payment-summary-heading">
                        <h2 id="payment-summary-heading" className="text-xl font-semibold text-gray-900 mb-6">Resumen de Pago</h2>
                        <dl className="space-y-3" role="list" aria-label="Resumen de precios">
                            <div className="flex justify-between text-gray-700" role="listitem">
                                <dt>Subtotal</dt>
                                <dd aria-label={`Subtotal: $${parseFloat(order.subtotal || 0).toFixed(2)}`}>
                                    ${parseFloat(order.subtotal || 0).toFixed(2)}
                                </dd>
                            </div>
                            <div className="flex justify-between text-gray-700" role="listitem">
                                <dt>IVA (16%)</dt>
                                <dd aria-label={`IVA 16%: $${parseFloat(order.tax || 0).toFixed(2)}`}>
                                    ${parseFloat(order.tax || 0).toFixed(2)}
                                </dd>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200" role="listitem">
                                <dt>Total</dt>
                                <dd aria-label={`Total pagado: $${parseFloat(order.total || 0).toFixed(2)}`}>
                                    ${parseFloat(order.total || 0).toFixed(2)}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    {/* Notes Card */}
                    {order.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6" role="note" aria-label="Notas adicionales de la orden">
                            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Notas</h3>
                            <p className="text-sm text-yellow-700">{order.notes}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" aria-label="Acciones después de la compra">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => router.visit(route('orders.index'))}
                                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Ver historial completo de órdenes"
                            >
                                Ver Historial de Órdenes
                            </button>
                            <button
                                onClick={() => router.visit(route('menu.index'))}
                                className="flex-1 py-3 px-6 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Continuar comprando en el menú"
                            >
                                Continuar Comprando
                            </button>
                            <button
                                onClick={() => router.visit('/')}
                                className="flex-1 py-3 px-6 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Ir a la página de inicio"
                            >
                                Ir a Inicio
                            </button>
                        </div>
                    </nav>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}

