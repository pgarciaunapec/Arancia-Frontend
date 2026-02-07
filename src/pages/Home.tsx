import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ArrowDown, Star, Users, Award, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface HomeProps {
  onShowModal: () => void;
}

const Home: React.FC<HomeProps> = ({ onShowModal }) => {
  const features = [
    {
      icon: <Award className="w-6 h-6" />,
      title: '40+ Años',
      description: 'De excelencia gastronómica'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Chef Gourmet',
      description: 'Cocina de alta calidad'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Eventos Privados',
      description: 'Espacios personalizados'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Reservaciones',
      description: 'Servicio rápido y eficiente'
    }
  ];

  const services = [
    {
      title: 'Experiencia Gastronómica',
      description: 'Sabores únicos en un ambiente sofisticado y acogedor',
      image: 'https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5nfGVufDF8fHx8MTc3MDM1ODQyOXww&ixlib=rb-4.1.0&q=80&w=1080',
      link: '/menu'
    },
    {
      title: 'Eventos Especiales',
      description: 'Celebra ocasiones memorables con servicio personalizado',
      image: 'https://images.unsplash.com/photo-1758977404304-30ff5f68753c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBzZXR0aW5nJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzAzMzA4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      link: '/events'
    }
  ];

  return (
    <div className="w-full pt-20 lg:pt-0">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden w-full"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1762928289633-c1565bc92931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc3MDM3MDcwMnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block mb-4 sm:mb-6 bg-primary text-secondary px-4 sm:px-6 py-2 rounded-full font-bold text-sm border-2 border-primary-dark">
              ⭐ Más de 40 años de tradición
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 tracking-tight"
          >
            Gastronomía
            <span className="block text-gradient mt-2">Excepcional</span>
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
            <Button
              size="lg"
              onClick={onShowModal}
              className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg"
            >
              Reservar Mesa
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg"
            >
              <Link to="/menu">Ver Menú</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator - Circular with Arrow */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-12 h-12 rounded-full bg-primary border-2 border-primary-dark flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <ArrowDown className="w-5 h-5 text-secondary" />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 w-full">
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
                <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-all border-border/50 bg-card h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-warm mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
              Nuestros Servicios
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Descubre experiencias culinarias únicas diseñadas para cada ocasión
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
                  <Card className="overflow-hidden group cursor-pointer border-border/50 hover:shadow-2xl transition-all">
                    <div className="relative h-64 sm:h-80 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{service.title}</h3>
                        <p className="text-sm sm:text-base text-white/90 mb-4">{service.description}</p>
                        <div className="flex items-center text-primary-light font-medium">
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
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-secondary text-secondary-foreground w-full">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Nuestra Historia</h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 text-secondary-foreground/90 px-4">
              Durante más de cuatro décadas, BOB TORONJA ha sido sinónimo de
              excelencia gastronómica en Santa Fe. Nuestra pasión por la
              hospitalidad y la tradición se refleja en cada plato que servimos.
              Combinamos técnicas culinarias contemporáneas con ingredientes
              locales de la más alta calidad, creando experiencias memorables
              para nuestros comensales.
            </p>
            <Button
              variant="outline"
              asChild
              className="border-2 border-primary text-primary hover:bg-primary hover:text-secondary"
            >
              <Link to="/about">
                Conoce Más Sobre Nosotros
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 w-full">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden border-none">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1615391532817-b007c4550f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwZ2xhc3NlcyUyMHJlc3RhdXJhbnQlMjBhdG1vc3BoZXJlfGVufDF8fHx8MTc3MDQxNTI3NXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Reservations"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-hero" />
              </div>
              <div className="relative z-10 p-8 sm:p-12 text-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                  Vive una Experiencia Inolvidable
                </h3>
                <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Reserva tu mesa ahora y disfruta de una experiencia gastronómica
                  excepcional en nuestro restaurante
                </p>
                <Button
                  size="lg"
                  onClick={onShowModal}
                  className="bg-secondary text-primary border-2 border-primary hover:bg-secondary-light px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg"
                >
                  Reservar Ahora
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
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