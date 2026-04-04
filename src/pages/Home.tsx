import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Star,
  Users,
  Award,
  Clock,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const COLORS = {
  primary: "#f5b400",
  primaryDark: "#cc9600",
  secondary: "#2d1f0f",
  secondaryLight: "#4a3520",
  white: "#ffffff",
};

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Check if user is at bottom of page
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Check if at bottom (within 100px)
      setIsAtBottom(scrollTop + windowHeight >= docHeight - 100);

      // Update current section index based on scroll position
      const sections = document.querySelectorAll("section[data-section]");
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          setCurrentSectionIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollClick = () => {
    if (isAtBottom) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll to next section
      const sections = document.querySelectorAll("section[data-section]");
      const nextIndex = currentSectionIndex + 1;
      if (nextIndex < sections.length) {
        sections[nextIndex].scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const features = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "40+ Años",
      description: "De excelencia gastronómica",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Chef Gourmet",
      description: "Cocina de alta calidad",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Eventos Privados",
      description: "Espacios personalizados",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Reservaciones",
      description: "Servicio rápido y eficiente",
    },
  ];

  const services = [
    {
      title: "Experiencia Gastronómica",
      description: "Sabores únicos en un ambiente sofisticado y acogedor",
      image:
        "https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5nfGVufDF8fHx8MTc3MDM1ODQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
      link: "/menu",
    },
    {
      title: "Eventos Especiales",
      description: "Celebra ocasiones memorables con servicio personalizado",
      image:
        "https://images.unsplash.com/photo-1758977404304-30ff5f68753c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBzZXR0aW5nJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzAzMzA4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      link: "/events",
    },
  ];

  return (
    <div className="w-full sm:pt-20 lg:pt-0">
      {/* Hero Section */}
      <motion.section
        data-section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden w-full"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1762928289633-c1565bc92931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc3MDM3MDcwMnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto w-full">
          {/* <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <span
                            className="inline-block mb-4 sm:mb-6 px-4 sm:px-6 py-2 rounded-full font-bold text-sm"
                            style={{ backgroundColor: COLORS.primary, color: COLORS.secondary, border: `2px solid ${COLORS.primaryDark}` }}
                        >
                            ⭐ Más de 40 años de tradición
                        </span>
                    </motion.div> */}

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mt-12 mb-4 sm:mb-6 tracking-tight"
          >
            Gastronomía
            <span className="block mt-2" style={{ color: COLORS.primary }}>
              Excepcional
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Experimenta la auténtica cocina regional en un ambiente elegante.
            Tradición, sabor y excelencia en cada plato.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
          >
            {/* Primary Button */}
            <Button size="lg" asChild>
              <Link to="/reservations">
                Reservar Mesa
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            {/* Outline Button */}
            <Button size="lg" variant="outline" asChild>
              <Link to="/menu">Ver Menú</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Floating Scroll Button - Fixed at bottom */}
      <motion.button
        onClick={handleScrollClick}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-lg"
        style={{
          backgroundColor: COLORS.primary,
          border: `2px solid ${COLORS.primaryDark}`,
        }}
      >
        {isAtBottom ? (
          <ArrowUp className="w-6 h-6" style={{ color: COLORS.secondary }} />
        ) : (
          <ArrowDown className="w-6 h-6" style={{ color: COLORS.secondary }} />
        )}
      </motion.button>

      {/* Features Section */}
      <section
        data-section
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full"
        style={{ backgroundColor: COLORS.secondary }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-4 sm:p-6 text-center transition-all h-full"
                  style={{
                    backgroundColor: COLORS.secondaryLight,
                    border: `2px solid ${COLORS.primary}`,
                  }}
                >
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: COLORS.secondary,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="font-bold text-base sm:text-lg mb-2"
                    style={{ color: COLORS.white }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        data-section
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 w-full"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4"
              style={{ color: COLORS.white }}
            >
              Nuestros Servicios
            </h2>
            <p
              className="text-base sm:text-lg max-w-2xl mx-auto px-4"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Descubre experiencias culinarias únicas diseñadas para cada
              ocasión
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Link to={service.link}>
                  <Card
                    className="overflow-hidden group cursor-pointer transition-all hover:scale-105"
                    style={{ border: `2px solid ${COLORS.primary}` }}
                  >
                    <div className="relative h-64 sm:h-80 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                          {service.title}
                        </h3>
                        <p className="text-sm sm:text-base text-white/90 mb-4">
                          {service.description}
                        </p>
                        <div
                          className="flex items-center font-medium"
                          style={{ color: COLORS.primary }}
                        >
                          Explorar
                          <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section
        data-section
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 w-full"
        style={{ backgroundColor: COLORS.secondary }}
      >
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <h2
              className="w-full text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8"
              style={{ color: COLORS.white }}
            >
              Nuestra Historia
            </h2>
            <p
              className="max-w-3xl mx-auto text-center text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 px-4"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Durante más de cuatro décadas, Arancia ha sido sinónimo de
              excelencia gastronómica en Santa Fe. Nuestra pasión por la
              hospitalidad y la tradición se refleja en cada plato que servimos.
              Combinamos técnicas culinarias contemporáneas con ingredientes
              locales de la más alta calidad, creando experiencias memorables
              para nuestros comensales.
            </p>
            {/* Outline Button */}
            <Button variant="outline" className="mx-auto" asChild>
              <Link to="/about" className="flex items-center gap-2">
                Conoce Más Sobre Nosotros
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        data-section
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 w-full"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card
              className="relative overflow-hidden"
              style={{ border: `2px solid ${COLORS.primary}` }}
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1615391532817-b007c4550f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwZ2xhc3NlcyUyMHJlc3RhdXJhbnQlMjBhdG1vc3BoZXJlfGVufDF8fHx8MTc3MDQxNTI3NXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Reservations"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                    opacity: 0.9,
                  }}
                />
              </div>
              <div className="relative z-10 p-8 sm:p-12 text-center">
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
                  style={{ color: COLORS.secondary }}
                >
                  Vive una Experiencia Inolvidable
                </h3>
                <p
                  className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto"
                  style={{ color: COLORS.secondaryLight }}
                >
                  Reserva tu mesa ahora y disfruta de una experiencia
                  gastronómica excepcional en nuestro restaurante
                </p>
                {/* Secondary Button */}
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/reservations">
                    Reservar Ahora
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
