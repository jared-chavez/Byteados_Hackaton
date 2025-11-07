import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Menu({ categories, products }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [quantity, setQuantity] = useState({});

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category_id === selectedCategory)
        : products;

    const handleAddToCart = async (productId) => {
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
            toast.error(error.response?.data?.message || error.message || 'No se pudo agregar el producto');
        }
    };

    const handleQuantityChange = (productId, value) => {
        setQuantity(prev => ({
            ...prev,
            [productId]: parseInt(value) || 1
        }));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <Head title="Menú" />
            
            <h1>Menú - Testing</h1>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => router.visit(route('cart.index'))}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Ver Carrito
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
                    Inicio
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '200px' }}>
                    <h2>Categorías</h2>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px',
                            marginBottom: '5px',
                            backgroundColor: selectedCategory === null ? '#007bff' : '#f0f0f0',
                            color: selectedCategory === null ? 'white' : 'black',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Todas
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px',
                                marginBottom: '5px',
                                backgroundColor: selectedCategory === category.id ? '#007bff' : '#f0f0f0',
                                color: selectedCategory === category.id ? 'white' : 'black',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div style={{ flex: 1 }}>
                    <h2>Productos</h2>
                    {filteredProducts.length === 0 ? (
                        <p>No hay productos disponibles</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '15px',
                                        borderRadius: '5px'
                                    }}
                                >
                                    <h3>{product.name}</h3>
                                    <p>{product.description || 'Sin descripción'}</p>
                                    <p><strong>Precio:</strong> ${product.price}</p>
                                    <p><strong>Stock:</strong> {product.stock}</p>
                                    {product.category && (
                                        <p><strong>Categoría:</strong> {product.category.name}</p>
                                    )}
                                    
                                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <label>
                                            Cantidad:
                                            <input
                                                type="number"
                                                min="1"
                                                max={product.stock}
                                                value={quantity[product.id] || 1}
                                                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                style={{
                                                    marginLeft: '5px',
                                                    padding: '5px',
                                                    width: '60px'
                                                }}
                                            />
                                        </label>
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            disabled={product.stock === 0}
                                            style={{
                                                padding: '8px 15px',
                                                backgroundColor: product.stock > 0 ? '#28a745' : '#ccc',
                                                color: 'white',
                                                border: 'none',
                                                cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
                                            }}
                                        >
                                            Agregar al Carrito
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

