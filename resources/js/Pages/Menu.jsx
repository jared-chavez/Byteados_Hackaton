import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaHome, FaCoffee } from 'react-icons/fa';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../css/dashboard.css';

export default function Menu({ categories, products }) {
    const { auth } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [quantity, setQuantity] = useState({});

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category_id === selectedCategory)
        : products;

    const handleAddToCart = async (productId) => {
        if (!auth?.user) {
            toast.warning('Debes iniciar sesión para agregar productos al carrito');
            router.visit(route('login'));
            return;
        }

        const qty = quantity[productId] || 1;
        
        try {
            const response = await axios.post('/api/v1/cart/items', {
                product_id: productId,
                quantity: parseInt(qty),
            });
            
            if (response.data.success) {
                toast.success('Producto agregado al carrito');
            } else {
                toast.error(response.data.message || 'No se pudo agregar el producto');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.warning('Debes iniciar sesión para agregar productos al carrito');
                router.visit(route('login'));
            } else {
                toast.error(error.response?.data?.message || error.message || 'No se pudo agregar el producto');
            }
        }
    };

    const handleQuantityChange = (productId, value) => {
        setQuantity(prev => ({
            ...prev,
            [productId]: parseInt(value) || 1
        }));
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return 'out';
        if (stock <= 10) return 'low';
        return '';
    };

    // Función para obtener emoticón según categoría
    const getCategoryEmoji = (categoryName) => {
        if (!categoryName) return '🍽️';
        
        const name = categoryName.toLowerCase();
        
        // Mapeo de categorías a emoticones
        if (name.includes('comida rápida') || name.includes('rapida') || name.includes('hamburguesa') || name.includes('hot dog') || name.includes('pizza')) {
            return '🍔';
        }
        if (name.includes('bebida caliente') || name.includes('caliente') || name.includes('café') || name.includes('cafe') || name.includes('té') || name.includes('te')) {
            return '☕';
        }
        if (name.includes('bebida fría') || name.includes('fria') || name.includes('refresco') || name.includes('jugo') || name.includes('batido')) {
            return '🥤';
        }
        if (name.includes('snack') || name.includes('botana') || name.includes('papas')) {
            return '🍿';
        }
        if (name.includes('postre') || name.includes('dulce') || name.includes('helado') || name.includes('pastel')) {
            return '🍰';
        }
        if (name.includes('torta') || name.includes('sandwich') || name.includes('sándwich')) {
            return '🥪';
        }
        if (name.includes('ensalada') || name.includes('saludable')) {
            return '🥗';
        }
        
        // Emoticon por defecto
        return '🍽️';
    };

    // Función para obtener emoticón según nombre del producto (más específico)
    const getProductEmoji = (productName, categoryName) => {
        if (!productName) return getCategoryEmoji(categoryName);
        
        const name = productName.toLowerCase();
        
        // Mapeo específico de productos
        if (name.includes('hamburguesa') || name.includes('burger')) return '🍔';
        if (name.includes('hot dog')) return '🌭';
        if (name.includes('pizza')) return '🍕';
        if (name.includes('torta') || name.includes('sandwich') || name.includes('sándwich')) return '🥪';
        // Pastel de chocolate específicamente (ANTES de validar "té" porque "Pastel" contiene "te")
        if (name.includes('pastel') && name.includes('chocolate')) return '🍰';
        if (name.includes('pastel') || name.includes('cake')) return '🎂';
        if (name.includes('café') || name.includes('cafe') || name.includes('coffee')) return '☕';
        // Validar "té" de forma más específica para evitar conflictos con "pastel"
        if ((name.includes('té') || name.includes('tea')) && !name.includes('pastel')) return '🫖';
        if (name.includes('refresco') || name.includes('soda') || name.includes('cola')) return '🥤';
        if (name.includes('jugo') || name.includes('juice')) return '🧃';
        if (name.includes('batido') || name.includes('smoothie') || name.includes('shake')) return '🥤';
        if (name.includes('frappé') || name.includes('frappe')) {
            // Frappé de fresa específicamente
            if (name.includes('fresa') || name.includes('strawberry')) return '🍓';
            return '🥤';
        }
        if (name.includes('agua')) return '💧';
        if (name.includes('papas') || name.includes('fries')) return '🍟';
        // Nachos con queso específicamente
        if (name.includes('nachos') && (name.includes('queso') || name.includes('cheese'))) return '🧀';
        if (name.includes('nachos')) return '🌮';
        if (name.includes('postre') || name.includes('dulce')) return '🍰';
        if (name.includes('helado') || name.includes('ice cream')) return '🍦';
        if (name.includes('galleta') || name.includes('cookie')) return '🍪';
        if (name.includes('ensalada') || name.includes('salad')) return '🥗';
        if (name.includes('taco')) return '🌮';
        if (name.includes('burrito')) return '🌯';
        if (name.includes('quesadilla')) return '🧀';
        
        // Si no hay match específico, usar el de la categoría
        return getCategoryEmoji(categoryName);
    };

    const MenuContent = () => (
        <main className="menu-page" role="main" aria-label="Menú de productos">
            <div className="menu-container">
                {/* Sidebar */}
                <aside className="menu-sidebar" role="complementary" aria-label="Filtros y navegación del menú">
                    <header className="menu-header">
                        <h1 className="menu-title">Menú</h1>
                        <nav className="menu-actions" aria-label="Acciones del menú">
                            {auth?.user && (
                                <button
                                    onClick={() => router.visit(route('cart.index'))}
                                    className="menu-action-btn menu-action-btn-primary focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                                    aria-label="Ver carrito de compras"
                                >
                                    <FaShoppingCart className="w-4 h-4" aria-hidden="true" />
                                    <span>Ver Carrito</span>
                                </button>
                            )}
                            <button
                                onClick={() => router.visit('/')}
                                className="menu-action-btn menu-action-btn-secondary focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                                aria-label="Ir a la página de inicio"
                            >
                                <FaHome className="w-4 h-4" aria-hidden="true" />
                                <span>Inicio</span>
                            </button>
                            {!auth?.user && (
                                <button
                                    onClick={() => router.visit(route('login'))}
                                    className="menu-action-btn menu-action-btn-primary focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                                    aria-label="Iniciar sesión para agregar productos al carrito"
                                >
                                    <span>Iniciar Sesión</span>
                                </button>
                            )}
                        </nav>
                    </header>

                    <nav className="menu-categories" aria-label="Filtro por categorías">
                        <h2 className="menu-categories-title">Categorías</h2>
                        <div role="list" aria-label="Lista de categorías">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`menu-category-btn focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black ${selectedCategory === null ? 'active' : ''}`}
                                role="listitem"
                                aria-pressed={selectedCategory === null}
                                aria-label="Mostrar todas las categorías"
                            >
                                <span className="menu-category-emoji" aria-hidden="true">🍽️</span>
                                Todas
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`menu-category-btn focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black ${selectedCategory === category.id ? 'active' : ''}`}
                                    role="listitem"
                                    aria-pressed={selectedCategory === category.id}
                                    aria-label={`Filtrar productos por categoría ${category.name}`}
                                >
                                    <span className="menu-category-emoji" aria-hidden="true">
                                        {getCategoryEmoji(category.name)}
                                    </span>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* Products Content */}
                <section className="menu-content" aria-labelledby="products-heading">
                    <header className="menu-products-header">
                        <h2 id="products-heading" className="menu-products-title">
                            {selectedCategory 
                                ? categories.find(c => c.id === selectedCategory)?.name || 'Productos'
                                : 'Productos'
                            }
                            <span className="sr-only">
                                {filteredProducts.length > 0 
                                    ? ` - ${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} disponible${filteredProducts.length !== 1 ? 's' : ''}`
                                    : ' - Sin productos disponibles'
                                }
                            </span>
                        </h2>
                    </header>

                    {filteredProducts.length === 0 ? (
                        <div className="menu-empty" role="status" aria-live="polite">
                            <div className="menu-empty-icon" aria-hidden="true">
                                <FaCoffee size={48} />
                            </div>
                            <p>No hay productos disponibles en esta categoría</p>
                        </div>
                    ) : (
                        <div className="menu-products-grid" role="list" aria-label="Lista de productos">
                            {filteredProducts.map(product => {
                                const stockStatus = getStockStatus(product.stock);
                                const stockStatusText = product.stock === 0 
                                    ? 'Agotado' 
                                    : product.stock <= 10 
                                        ? 'Stock bajo' 
                                        : 'Disponible';
                                const quantityId = `quantity-${product.id}`;
                                const stockId = `stock-${product.id}`;
                                
                                return (
                                    <article 
                                        key={product.id} 
                                        className="menu-product-card"
                                        role="listitem"
                                        aria-labelledby={`product-name-${product.id}`}
                                    >
                                        <div className="menu-product-emoji" aria-hidden="true">
                                            {getProductEmoji(product.name, product.category?.name)}
                                        </div>
                                        <h3 id={`product-name-${product.id}`} className="menu-product-name">
                                            {product.name}
                                        </h3>
                                        <p className="menu-product-description">
                                            {product.description || 'Sin descripción'}
                                        </p>
                                        
                                        <dl className="menu-product-info" role="list">
                                            <div className="menu-product-info-item" role="listitem">
                                                <dt className="menu-product-info-label">Precio:</dt>
                                                <dd className="menu-product-price" aria-label={`Precio: $${parseFloat(product.price).toFixed(2)}`}>
                                                    ${parseFloat(product.price).toFixed(2)}
                                                </dd>
                                            </div>
                                            <div className="menu-product-info-item" role="listitem">
                                                <dt className="menu-product-info-label">Stock:</dt>
                                                <dd 
                                                    id={stockId}
                                                    className={`menu-product-stock ${stockStatus}`}
                                                    aria-label={`Estado de stock: ${stockStatusText}, ${product.stock} unidades disponibles`}
                                                >
                                                    {product.stock} unidades
                                                    {product.stock === 0 && (
                                                        <span className="sr-only"> - Producto agotado</span>
                                                    )}
                                                    {product.stock > 0 && product.stock <= 10 && (
                                                        <span className="sr-only"> - Stock bajo</span>
                                                    )}
                                                </dd>
                                            </div>
                                            {product.category && (
                                                <div className="menu-product-info-item" role="listitem">
                                                    <dt className="menu-product-info-label">Categoría:</dt>
                                                    <dd className="menu-product-info-value" aria-label={`Categoría: ${product.category.name}`}>
                                                        {product.category.name}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                        
                                        <div className="menu-product-actions">
                                            <div className="menu-product-quantity">
                                                <label htmlFor={quantityId} className="menu-product-quantity-label">
                                                    Cantidad:
                                                </label>
                                                <input
                                                    id={quantityId}
                                                    type="number"
                                                    min="1"
                                                    max={product.stock}
                                                    value={quantity[product.id] || 1}
                                                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                    className="menu-product-quantity-input focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    aria-describedby={stockId}
                                                    aria-invalid={false}
                                                    aria-label={`Cantidad de ${product.name} a agregar al carrito`}
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                disabled={product.stock === 0}
                                                className="menu-product-add-btn focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label={
                                                    product.stock === 0 
                                                        ? `${product.name} está agotado y no se puede agregar al carrito`
                                                        : `Agregar ${quantity[product.id] || 1} ${product.name} al carrito`
                                                }
                                                aria-describedby={stockId}
                                            >
                                                <span>{product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );

    // Si el usuario está autenticado, usar AuthenticatedLayout, si no, renderizar directamente
    if (auth?.user) {
        return (
            <AuthenticatedLayout>
                <Head title="Menú" />
                <MenuContent />
            </AuthenticatedLayout>
        );
    }

    return (
        <>
            <Head title="Menú" />
            <MenuContent />
        </>
    );
}

