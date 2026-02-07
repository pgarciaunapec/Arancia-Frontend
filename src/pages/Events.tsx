import React from 'react';
import { motion } from 'motion/react';
import { PartyPopper, Briefcase, UtensilsCrossed, Music, Calendar, ArrowRight, Phone } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

interface EventsPageProps {
  onShowModal: () => void;
}

const Events: React.FC<EventsPageProps> = ({ onShowModal }) => {
  const eventTypes = [
    {
      icon: <PartyPopper className="w-8 h-8" />,
      title: 'Eventos Sociales',
      description: 'Bodas, aniversarios, cumpleaños y celebraciones familiares',
      features: ['Menús personalizados', 'Decoración incluida', 'Hasta 150 personas', 'Servicio de bar']
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Eventos Corporativos',
      description: 'Reuniones de negocios, conferencias y cenas empresariales',
      features: ['Equipos audiovisuales', 'Wi-Fi de alta velocidad', 'Catering ejecutivo', 'Espacios privados']
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: 'Menús Personalizados',
      description: 'Diseñamos menús especiales adaptados a tus necesidades',
      features: ['Opciones veganas', 'Sin gluten disponible', 'Chef a la vista', 'Degustación previa']
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Ambiente Especial',
      description: 'Decoración, música y servicio para crear la atmósfera perfecta',
      features: ['Música en vivo', 'Iluminación ambiental', 'Decoración temática', 'Fotografía profesional']
    }
  ];

  const packages = [
    {
      name: 'Esencial',
      price: 'RD$2,500',
      description: 'Perfecto para reuniones íntimas',
      features: [
        '20-40 personas',
        'Menú de 3 tiempos',
        'Decoración básica',
        'Servicio de meseros',
        '4 horas de evento'
      ]
    },
    {
      name: 'Premium',
      price: 'RD$5,000',
      description: 'Ideal para celebraciones especiales',
      features: [
        '40-80 personas',
        'Menú de 4 tiempos',
        'Decoración personalizada',
        'Servicio de bar',
        'Música en vivo',
        '6 horas de evento'
      ],
      featured: true
    },
    {
      name: 'Elite',
      price: 'RD$10,000',
      description: 'La experiencia completa',
      features: [
        '80-150 personas',
        'Menú gourmet 5 tiempos',
        'Decoración exclusiva',
        'Bar premium',
        'Banda en vivo',
        'Fotografía profesional',
        '8 horas de evento'
      ]
    }
  ];

  return (
    <div className="w-full min-h-full">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden w-full"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1758977404304-30ff5f68753c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBzZXR0aW5nJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzAzMzA4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-4 sm:mb-6 bg-white/20 backdrop-blur-sm border-white/30 text-white px-4 sm:px-6 py-2 text-xs sm:text-sm">
              🎉 Eventos Especiales
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6"
          >
            Eventos Privados
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-4"
          >
            Celebra momentos especiales en BOB TORONJA con espacios privados,
            menús personalizados y un servicio excepcional
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              onClick={onShowModal}
              className="bg-white text-primary hover:bg-white/90 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl shadow-xl hover:scale-105 transition-all"
            >
              <Calendar className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Solicitar Cotización
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Event Types */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
              Tipos de Eventos
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Diseñamos experiencias únicas para cada ocasión especial
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {eventTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 sm:p-6 h-full hover:shadow-xl transition-all border-border/50 bg-card">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-warm mb-3 sm:mb-4 flex items-center justify-center text-white">
                    {type.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">{type.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{type.description}</p>
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm sm:text-base">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
              Paquetes de Eventos
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Elige el paquete perfecto para tu celebración
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {pkg.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-accent text-accent-foreground shadow-lg text-xs sm:text-sm">
                    ⭐ Más Popular
                  </Badge>
                )}
                <Card className={`p-6 sm:p-8 h-full flex flex-col border-border/50 ${
                  pkg.featured 
                    ? 'bg-gradient-warm text-white shadow-2xl scale-100 lg:scale-105' 
                    : 'bg-card hover:shadow-xl'
                } transition-all`}>
                  <div className="text-center mb-4 sm:mb-6">
                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
                      pkg.featured ? 'text-white' : 'text-foreground'
                    }`}>
                      {pkg.name}
                    </h3>
                    <div className={`text-3xl sm:text-4xl font-bold mb-2 ${
                      pkg.featured ? 'text-white' : 'text-primary'
                    }`}>
                      {pkg.price}
                    </div>
                    <p className={`text-xs sm:text-sm ${
                      pkg.featured ? 'text-white/80' : 'text-muted-foreground'
                    }`}>
                      {pkg.description}
                    </p>
                  </div>

                  <div className="flex-1 mb-4 sm:mb-6">
                    <ul className="space-y-2 sm:space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            pkg.featured ? 'bg-white/20' : 'bg-primary/10'
                          }`}>
                            <span className={pkg.featured ? 'text-white text-xs' : 'text-primary text-xs'}>✓</span>
                          </div>
                          <span className={`text-sm sm:text-base ${
                            pkg.featured ? 'text-white/90' : 'text-muted-foreground'
                          }`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={onShowModal}
                    className={`w-full ${
                      pkg.featured
                        ? 'bg-white text-primary hover:bg-white/90'
                        : 'bg-gradient-warm text-white hover:shadow-lg'
                    } py-5 sm:py-6 rounded-xl transition-all hover:scale-105 text-sm sm:text-base`}
                  >
                    Solicitar Información
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-secondary text-secondary-foreground w-full">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para Planear Tu Evento?
            </h2>
            <p className="text-xl text-secondary-foreground/90 mb-8 leading-relaxed">
              Contáctanos para discutir los detalles de tu evento y recibir una
              cotización personalizada. Nuestro equipo está listo para hacer de
              tu celebración una experiencia inolvidable.
            </p>
            <Button
              size="lg"
              onClick={onShowModal}
              className="bg-white text-secondary hover:bg-white/90 px-8 py-6 text-lg rounded-xl shadow-xl hover:scale-105 transition-all"
            >
              <Phone className="mr-2 w-5 h-5" />
              Contactar Ahora
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;