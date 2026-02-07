import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  onShowModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add shadow when scrolled
      setScrolled(currentScrollY > 50);
      
      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <h1>BOB TORONJA</h1>
          </Link>
        </div>
        <nav className="navigation">
          <ul>
            <li><Link to="/about" className="nav-link">Sobre Nosotros</Link></li>
            <li><Link to="/events" className="nav-link">Eventos Privados</Link></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onShowModal(); }} className="nav-link">Contacto</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <Link to="/menu" className="btn-primary">Ordenar En Línea</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
