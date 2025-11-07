import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import '../../css/page.css';

export default function Page({ auth }) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const totalSlides = 2;

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
        }, 60000); // Change slide every 1 minute (60 seconds)

        return () => clearInterval(interval);
    }, []);

    // Update slides visibility
    useEffect(() => {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlideIndex);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
        });
    }, [currentSlideIndex]);

    const changeSlide = (direction) => {
        setCurrentSlideIndex((prev) => {
            const newIndex = prev + direction;
            if (newIndex < 0) return totalSlides - 1;
            if (newIndex >= totalSlides) return 0;
            return newIndex;
        });
    };

    const currentSlide = (index) => {
        setCurrentSlideIndex(index - 1);
    };
    return (
        <div className="coffee-app">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-logo">
                        <span className="logo-japanese">☕</span>
                        <span className="logo-text">XpressUTC</span>
                    </div>
                    
                    <div className="navbar-links">
                        <a href="#inicio" className="navbar-link">Inicio</a>
                        <a href="#menu" className="navbar-link">Menú</a>
                        <a href="#contacto" className="navbar-link">Contacto</a>
                    </div>
                    
                    <div className="navbar-buttons">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="navbar-btn navbar-btn-green"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="navbar-btn navbar-btn-green-outline"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="navbar-btn navbar-btn-green"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-carousel">
                    <div className="carousel-container">
                        <div className="carousel-slide active">
                            <img src="/images/cafeteria1.png" alt="Cafetería UTC - Ambiente 1" />
                            <div className="carousel-overlay">
                                <div className="hero-content">
                                    <h1 className="japanese-title">☕</h1>
                                    <h2 className="main-title">ARTE DEL CAFÉ</h2>
                                    <p className="hero-description">
                                        Descubre la perfecta armonía entre sabor, ambiente y estudio. Un espacio diseñado para la excelencia académica y el placer gastronómico.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-slide">
                            <img src="/images/cafeteria2.png" alt="Cafetería UTC - Ambiente 2" />
                            <div className="carousel-overlay">
                                <div className="hero-content">
                                    <h1 className="japanese-title">📚</h1>
                                    <h2 className="main-title">SANTUARIO DE ESTUDIO</h2>
                                    <p className="hero-description">
                                        Donde cada sorbo inspira y cada momento cuenta. Tu refugio académico en el corazón del campus universitario.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button className="carousel-btn carousel-prev" onClick={() => changeSlide(-1)}>
                        <span>‹</span>
                    </button>
                    <button className="carousel-btn carousel-next" onClick={() => changeSlide(1)}>
                        <span>›</span>
                    </button>
                    
                    <div className="carousel-dots">
                        <span className="dot active" onClick={() => currentSlide(1)}></span>
                        <span className="dot" onClick={() => currentSlide(2)}></span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="feature-item">
                    <div className="feature-icon icon-1">📶</div>
                    <h3>CONECTIVIDAD</h3>
                    <p>WiFi de alta velocidad y espacios con tomas eléctricas para una experiencia de estudio sin interrupciones</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon icon-2">🎯</div>
                    <h3>AMBIENTE PREMIUM</h3>
                    <p>Diseño acústico optimizado y iluminación natural para maximizar tu concentración y productividad</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon icon-3">⏰</div>
                    <h3>HORARIOS FLEXIBLES</h3>
                    <p>Abierto desde las 6:00 AM hasta las 9:00 PM para adaptarse a tu rutina académica</p>
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="what-we-offer">
                <h2>LO QUE OFRECEMOS</h2>
                <p>Una experiencia gastronómica cuidadosamente curada para la comunidad académica. Cada producto refleja nuestro compromiso con la calidad, la innovación y el bienestar estudiantil.</p>
                
                <div className="offer-grid">
                    <div className="offer-item">
                        <div className="offer-image offer-1"></div>
                        <h3>CAFÉ ESPECIALIZADO</h3>
                        <p>Granos selectos de origen único</p>
                    </div>
                    <div className="offer-item">
                        <div className="offer-image offer-2"></div>
                        <h3>BOWLS SALUDABLES</h3>
                        <p>Nutrición balanceada para el cerebro</p>
                    </div>
                    <div className="offer-item">
                        <div className="offer-image offer-3"></div>
                        <h3>BATIDOS FRESCOS</h3>
                        <p>Energía natural en cada sorbo</p>
                    </div>
                    <div className="offer-item">
                        <div className="offer-image offer-4"></div>
                        <h3>SNACKS GOURMET</h3>
                        <p>Sabores sofisticados y saludables</p>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="quote-section">
                <div className="quote-content">
                    <blockquote>
                        "Solo los mejores granos merecen crear una gran taza de café"
                    </blockquote>
                    <cite>— Filosofía de la Excelencia</cite>
                </div>
                <div className="smoke-effect"></div>
            </section>

            {/* Special Menu Section */}
            <section className="special-menu">
                <h2>MENÚ ESPECIAL</h2>
                <p>Creaciones exclusivas que combinan tradición culinaria con innovación gastronómica. Cada plato es una experiencia diseñada para nutrir tanto el cuerpo como la mente académica.</p>
                
                <div className="menu-grid">
                    <div className="menu-item featured">
                        <div className="menu-badge">MÁS POPULAR</div>
                        <div className="menu-image menu-1"></div>
                        <h3>COMBO ESTUDIANTE</h3>
                        <p>Café premium + sándwich artesanal + galleta casera</p>
                        <span className="price">$8.500</span>
                        <div className="savings">Ahorra $2.500</div>
                    </div>
                    <div className="menu-item">
                        <div className="menu-image menu-2"></div>
                        <h3>RITUAL MATUTINO</h3>
                        <p>Café especializado + tostada integral + jugo natural</p>
                        <span className="price">$12.000</span>
                        <div className="savings">Ahorra $3.000</div>
                    </div>
                    <div className="menu-item healthy">
                        <div className="menu-badge healthy-badge">BIENESTAR</div>
                        <div className="menu-image menu-3"></div>
                        <h3>BOWL ENERGÉTICO</h3>
                        <p>Batido de superalimentos + ensalada de quinoa + fruta de temporada</p>
                        <span className="price">$15.000</span>
                        <div className="savings">Ahorra $4.000</div>
                    </div>
                    <div className="menu-item study-pack">
                        <div className="menu-badge study-badge">ZONA ESTUDIO</div>
                        <div className="menu-image menu-4"></div>
                        <h3>PACK CONCENTRACIÓN</h3>
                        <p>Café grande + snack cerebral + WiFi premium</p>
                        <span className="price">$10.000</span>
                        <div className="study-perks">+ Mesa reservada 3hrs</div>
                    </div>
                </div>
            </section>

            {/* Student Benefits Section */}
            <section className="student-benefits">
                <h2>PRIVILEGIOS EXCLUSIVOS</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-icon">🎓</div>
                        <h3>DESCUENTO ACADÉMICO</h3>
                        <p>15% de descuento con carnet estudiantil válido - apoyamos tu trayectoria educativa</p>
                        <div className="benefit-highlight">Válido todos los días</div>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">⏰</div>
                        <h3>HORA DE ESTUDIO ESPECIAL</h3>
                        <p>2x1 en café durante horas pico de estudio (2:00 PM - 4:00 PM)</p>
                        <div className="benefit-highlight">Perfecto para sesiones grupales</div>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">📚</div>
                        <h3>ZONA PREMIUM DE ESTUDIO</h3>
                        <p>Mesas silenciosas reservadas con cualquier compra superior a $15.000</p>
                        <div className="benefit-highlight">Silencio garantizado</div>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">🏆</div>
                        <h3>PROGRAMA DE FIDELIDAD</h3>
                        <p>Gana puntos con cada compra, canjea recompensas exclusivas</p>
                        <div className="benefit-highlight">10 visitas = 1 café gratis</div>
                    </div>
                </div>
            </section>

            {/* Live Features Section */}
            <section className="live-features">
                <h2>LIVE NOW</h2>
                <div className="live-grid">
                    <div className="live-card">
                        <div className="live-indicator">🔴 LIVE</div>
                        <h3>CURRENT CAPACITY</h3>
                        <div className="occupancy-meter">
                            <div className="occupancy-bar" style={{width: '65%'}}></div>
                        </div>
                        <p>65% occupied - Tables still available</p>
                    </div>
                    <div className="live-card">
                        <div className="live-indicator">⏱️ REAL TIME</div>
                        <h3>WAIT TIME</h3>
                        <div className="wait-time">3-5 min</div>
                        <p>Average preparation time</p>
                    </div>
                    <div className="live-card">
                        <div className="live-indicator">🎵 NOW PLAYING</div>
                        <h3>AMBIENT SOUND</h3>
                        <div className="music-genre">Lo-Fi Study Beats</div>
                        <p>Perfect for concentration</p>
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="social-proof">
                <h2>STUDENT VOICES</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <p>"An oasis of tranquility in the academic chaos. The coffee is exceptional and the atmosphere inspires deep focus. This place has become essential to my study routine."</p>
                        <div className="student-info">
                            <strong>María González</strong>
                            <span>Systems Engineering - 7th semester</span>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <p>"Every detail here is thoughtfully designed for the academic mind. From the lighting to the acoustics, everything supports concentration and creativity."</p>
                        <div className="student-info">
                            <strong>Carlos Mendoza</strong>
                            <span>Business Administration - 5th semester</span>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <p>"More than a café, it's a sanctuary for intellectual growth. The quality of both the food and the environment exceeds all expectations."</p>
                        <div className="student-info">
                            <strong>Ana Rodríguez</strong>
                            <span>Psychology - 3rd semester</span>
                        </div>
                    </div>
                </div>
                <div className="social-stats">
                    <div className="stat">
                        <div className="stat-number">4.9/5</div>
                        <div className="stat-label">Average rating</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">3,247</div>
                        <div className="stat-label">Satisfied students</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">98%</div>
                        <div className="stat-label">Recommend XpressUTC</div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="philosophy">
                <div className="philosophy-content">
                    <h2>Our Gastronomy Philosophy</h2>
                    <p>We believe in the perfect alchemy between exceptional flavor and inspiring atmosphere. Each cup of coffee is an invitation to excellence, each space is designed to awaken academic creativity. Our philosophy transcends the gastronomic: we are architects of experiences that nourish both intellect and senses, creating the perfect sanctuary where ideas flourish and academic dreams take shape.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>OPEN HOURS</h3>
                        <p>
                            Monday - Friday<br/>
                            6:00 AM - 9:00 PM<br/>
                            Saturday<br/>
                            8:00 AM - 6:00 PM<br/>
                            Sunday: Closed
                        </p>
                    </div>
                    <div className="footer-section">
                        <h3>AMENITIES</h3>
                        <p>
                            High-speed WiFi<br/>
                            Study spaces<br/>
                            Power outlets<br/>
                            Climate control<br/>
                            Curated playlists
                        </p>
                    </div>
                    <div className="footer-section">
                        <h3>LOCATION</h3>
                        <p>
                            UTC Campus<br/>
                            Central Building, Ground Floor<br/>
                            Cartagena, Colombia<br/>
                            Tel: (605) 123-4567<br/>
                            Email: cafe@utc.edu.co
                        </p>
                    </div>
                    <div className="footer-section">
                        <div className="map-placeholder"></div>
                    </div>
                </div>
            </footer>
        </div>
    );
}