import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import '../../css/page.css';

export default function Page() {
    const { auth } = usePage().props;
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const totalSlides = 2;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
        }, 5000); 

        return () => clearInterval(interval);
    }, []);
    
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
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-logo">
                        <img src="/images/logo.png" alt="XpressUTC Logo" className="logo" />
                        <span className="logo-text">XpressUTC</span>
                    </div>
                    
                    <button 
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    
                    <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                        <div className="navbar-links">
                            <Link href="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                            <Link href={route('menu.index')} className="navbar-link" onClick={() => setIsMenuOpen(false)}>Menú</Link>
                            {/* Enlace de contacto oculto temporalmente */}
                            {/* <Link
                                href={route('contact.index')}
                                className="navbar-link"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contacto
                            </Link> */}
                        </div>
                        
                        <div className="navbar-buttons">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="navbar-btn navbar-btn-green"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="navbar-btn navbar-btn-green-outline"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="navbar-btn navbar-btn-green"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-carousel">
                    <div className="carousel-container">
                        <div className="carousel-slide active">
                            <img src="/images/cafeteria1.png" alt="Cafetería UTC - Ambiente 1" />
                            <div className="carousel-overlay">
                                <div className="hero-content">
                                    <h2 className="main-title">Más Universidad</h2>
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

            {/* Services Section */}
            <section className="services-section">
                <div className="services-container">
                    <div className="services-header">
                        <span className="section-label">— Servicios</span>
                        <h2 className="section-title">
                            Servicios <span className="highlight-text">Que Ofrecemos</span>
                        </h2>
                    </div>
                </div>

                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">✨☕️</div>
                        <h3 className="service-title">Café Premium</h3>
                        <p className="service-description">
                            Disfruta de nuestros cafés especiales preparados con granos seleccionados y técnicas artesanales.
                        </p>
                        <Link href={route('menu.index')} className="service-link">
                            Conoce más <span>→</span>
                        </Link>
                    </div>

                    <div className="service-card">
                        <div className="service-icon">⭐🧁</div>
                        <h3 className="service-title">Repostería</h3>
                        <p className="service-description">
                            Deléitate con nuestra selección de pasteles, galletas y postres hechos diariamente.
                        </p>
                        <Link href={route('menu.index')} className="service-link">
                            Conoce más <span>→</span>
                        </Link>
                    </div>

                    <div className="service-card">
                        <div className="service-icon">📚</div>
                        <h3 className="service-title">Espacio de Estudio</h3>
                        <p className="service-description">
                            Ambiente tranquilo con WiFi de alta velocidad, enchufes y zonas diseñadas para estudiar.
                        </p>
                        <Link href={route('menu.index')} className="service-link">
                            Conoce más <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="about-container">
                    <div className="about-image-wrapper">
                        <div className="about-circle">
                            <img src="/images/barista.jpg" alt="Nuestro Barista" className="about-image" />
                            <div className="skill-badge badge-1">Bebidas,comidas,snacks</div>
                            <div className="skill-badge badge-2">Atención Personalizada</div>
                            <div className="skill-badge badge-3">Productos Frescos</div>
                            <div className="skill-badge badge-4">Ambiente Acogedor</div>
                        </div>
                    </div>

                    <div className="about-content">
                        <span className="section-label">Acerca de Nosotros</span>
                        <h2 className="section-title">
                            ¿Qué es <span className="highlight-text">XpressUTC?</span>
                        </h2>
                        <p className="about-description">
                            Somos más que una cafetería universitaria. Somos el punto de encuentro perfecto donde los estudiantes encuentran inspiración, energía y el ambiente ideal para estudiar o compartir con amigos.
                        </p>

                        <div className="about-stats">
                            <div className="stat-item">
                                <h3 className="stat-number">500+</h3>
                                <p className="stat-label">Estudiantes Diarios</p>
                            </div>
                            <div className="stat-item">
                                <h3 className="stat-number">30+</h3>
                                <p className="stat-label">Productos Diferentes</p>
                            </div>
                            <div className="stat-item">
                                <h3 className="stat-number">30</h3>
                                <p className="stat-label">Años de Experiencia</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="testimonials-header">
                    <h2 className="testimonials-title">Testimonios</h2>
                    <p className="testimonials-description">
                        Descubre lo que nuestros estudiantes dicen sobre su experiencia en XpressUTC. 
                        Un espacio donde el café se encuentra con la comunidad universitaria.
                    </p>
                </div>
            </section>

            {/* Menu Section */}
            <section className="menu-section">
                <h2 className="section-title-center">Nuestro Menú</h2>

                <div className="menu-grid">
                    <div className="menu-card">
                        <img src="/images/snacks.jpg" alt="Snacks" className="menu-image" />
                        <div className="menu-info">
                            <h3 className="menu-item-title">Snacks</h3>
                            <Link href={route('menu.index')} className="menu-btn">Ver Menu</Link>
                        </div>
                    </div>

                    <div className="menu-card">
                        <img src="/images/comida.jpg" alt="Comida" className="menu-image" />
                        <div className="menu-info">
                            <h3 className="menu-item-title">Comida</h3>
                            <Link href={route('menu.index')} className="menu-btn">Ver Menu</Link>
                        </div>
                    </div>

                    <div className="menu-card">
                        <img src="/images/bebidas.jpg" alt="Bebidas" className="menu-image" />
                        <div className="menu-info">
                            <h3 className="menu-item-title">Bebidas</h3>
                            <Link href={route('menu.index')} className="menu-btn">Ver Menu</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects/Gallery Section */}
            <section className="projects-section">
                <h2 className="section-title-center">Nuestros Espacios</h2>
                                
                <div className="projects-grid">
                    <div className="project-card">
                        <img src="/images/Zona_Estudio.jpg" alt="Zona de Estudio Individual" className="project-image" />
                        <div className="project-content">
                            <h3 className="project-title">Zona de Estudio Individual</h3>
                            <p className="project-description">
                                Espacios diseñados para concentración máxima con iluminación perfecta y comodidad.
                            </p>
                            <button className="project-btn">Conoce más</button>
                        </div>
                    </div>

                    <div className="project-card project-card-reverse">
                        <div className="project-content">
                            <h3 className="project-title">Área de Grupos</h3>
                            <p className="project-description">
                                Mesas amplias para trabajos en equipo y discusiones académicas productivas.
                            </p>
                            <button className="project-btn">Conoce más</button>
                        </div>
                        <img src="/images/Area_Grupos.jpg" alt="Área de Grupos" className="project-image" />
                    </div>

                    <div className="project-card">
                        <img src="/images/Zona_Relajacion.jpg" alt="Zona de Relajación" className="project-image" />
                        <div className="project-content">
                            <h3 className="project-title">Zona de Relajación</h3>
                            <p className="project-description">
                                Espacio cómodo para descansar entre clases y socializar con amigos.
                            </p>
                            <button className="project-btn">Conoce más</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <div className="newsletter-content">
                    <h2 className="newsletter-title">
                        ¿Quieres recibir nuestras ofertas y novedades?
                    </h2>
                    <p className="newsletter-description">
                        Suscríbete a nuestro boletín y recibe promociones exclusivas para estudiantes.
                    </p>
                    <button className="newsletter-btn">Suscribirse</button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logos">
                        <img src="/images/Logo-mas-universidad-pie-de-pagina.png" alt="Más Universidad" className="footer-logo" />
                        <img src="/images/logo.png" alt="XpressUTC Logo" className="footer-logo" />
                    </div>
                    <div className="footer-locations">
                        <h3>UBICACIONES</h3>
                        <div className="location-item">
                            <p><strong>Cafetería 1:</strong> Ubicada bajo el edificio 1</p>
                        </div>
                        <div className="location-item">
                            <p><strong>Cafetería 2:</strong> Ubicada a un costado de la biblioteca</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
