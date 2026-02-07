import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>BOB TORONJA</h2>
          </div>
          <div className="footer-links">
            <Link to="/about">Sobre Nosotros</Link>
            <Link to="/services">Servicios</Link>
            <Link to="/events">Eventos</Link>
            <a href="#contact">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
