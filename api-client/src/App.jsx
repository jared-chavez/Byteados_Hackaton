import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Cargar productos y categorías al iniciar
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ])
    .then(([productsData, categoriesData]) => {
      setProducts(productsData.data || productsData || [])
      setCategories(categoriesData.data || categoriesData || [])
      setLoading(false)
    })
    .catch(err => {
      setError('Error conectando con la API: ' + err.message)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🍕 XpressUTC - Cafetería Escolar</h1>
        <p>Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🍕 XpressUTC - Cafetería Escolar</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <p>Asegúrate de que el backend esté corriendo en http://localhost:8000</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🍕 XpressUTC</h1>
        <p>Cafetería Escolar - Universidad Tecnológica de Coahuila</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px' }}>
        {/* Sidebar de categorías */}
        <aside>
          <h3>Categorías</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button style={{ padding: '10px', border: '1px solid #ccc', background: '#f5f5f5' }}>
              Todas ({products.length})
            </button>
            {categories.map(category => (
              <button 
                key={category.id} 
                style={{ padding: '10px', border: '1px solid #ccc', background: 'white' }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Grid de productos */}
        <main>
          <h3>Productos Disponibles</h3>
          {products.length === 0 ? (
            <p>No hay productos disponibles. Agrega algunos desde el panel de administración.</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              {products.map(product => (
                <div 
                  key={product.id} 
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    padding: '15px',
                    background: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <h4 style={{ margin: '0 0 10px 0' }}>{product.name}</h4>
                  <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
                      ${product.price}
                    </span>
                    <span style={{ fontSize: '12px', color: product.stock > 0 ? '#16a34a' : '#dc2626' }}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  <button 
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      marginTop: '10px',
                      background: product.stock > 0 ? '#2563eb' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
                    }}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '40px', padding: '20px', borderTop: '1px solid #eee' }}>
        <p>🚀 API Status: Conectado | Productos: {products.length} | Categorías: {categories.length}</p>
      </footer>
    </div>
  )
}

export default App
