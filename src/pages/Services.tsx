import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Wine, Users, ChefHat, Clock, MapPin } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Utensils className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: 'Cena Gourmet',
      description: 'Experiencia gastronómica de alta cocina con ingredientes premium',
      features: ['Menú degustación', 'Maridaje de vinos', 'Chef\'s table', 'Servicio personalizado'],
      image: 'https://images.unsplash.com/photo-1737141500169-4208e3296b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwZ291cm1ldCUyMHJlc3RhdXJhbnQlMjBtZWFsfGVufDF8fHx8MTc3MDQyMDc5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      icon: <Wine className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: 'Bar & Cocteles',
      description: 'Selección exclusiva de vinos y cocteles artesanales',
      features: ['Carta de vinos premium', 'Mixología creativa', 'Destilados selectos', 'Happy hour'],
      image: 'https://images.unsplash.com/photo-1698054239930-1a96f42f87da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMG1peG9sb2d5JTIwZHJpbmtzfGVufDF8fHx8MTc3MDQyMDc5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      icon: <Users className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: 'Eventos Privados',
      description: 'Espacios exclusivos para celebraciones y reuniones',
      features: ['Salones privados', 'Menús personalizados', 'Decoración incluida', 'Servicio completo'],
      image: 'https://images.unsplash.com/photo-1759646827844-bbbdbfd0ada2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwZXZlbnQlMjBjZWxlYnJhdGlvbiUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzcwNDIwODAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      icon: <ChefHat className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: 'Catering',
      description: 'Servicio de catering para eventos externos',
      features: ['Chef a domicilio', 'Montaje completo', 'Personal capacitado', 'Equipamiento incluido'],
      image: 'https://images.unsplash.com/photo-1659354218430-ac7f0b31e977?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGNoZWYlMjBjb29raW5nJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MDQyMDgwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const hours = [
    { day: 'Lunes - Jueves', time: '12:00 PM - 10:00 PM' },
    { day: 'Viernes - Sábado', time: '12:00 PM - 11:30 PM' },
    { day: 'Domingo', time: '11:00 AM - 9:00 PM' }
  ];

  const locations = [
    {
      name: 'Restaurante Principal',
      address: 'Calle Principal #123, Santa Fe',
      phone: '(809) 555-0123',
      email: 'info@bobtoronja.com'
    }
  ];

  return (
    <div className="w-full min-h-full">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden w-full"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1710983165044-0cc32d1aab4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjBjb2xvcmZ1bCUyMGRpc2hlc3xlbnwxfHx8fDE3NzA0MjAxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-4 sm:mb-6 bg-primary/20 backdrop-blur-sm border-primary/30 text-primary-foreground px-4 sm:px-6 py-2 text-xs sm:text-sm">
              🍽️ Servicios
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
          >
            Nuestros Servicios
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed px-4"
          >
            Experiencias gastronómicas diseñadas para cada ocasión
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full hover:shadow-xl transition-all border-border/50 bg-card group">
                  <div className="relative h-56 sm:h-64 lg:h-72 xl:h-80 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white">
                          {service.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">{service.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-sm sm:text-base text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 w-full">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
              Horarios & Ubicación
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
              Visítanos y disfruta de nuestra excelente gastronomía
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 sm:p-8 h-full bg-card border-border/50">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">Horarios</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {hours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 sm:py-3 border-b border-border last:border-b-0"
                    >
                      <span className="font-medium text-sm sm:text-base text-foreground">{schedule.day}</span>
                      <span className="text-sm sm:text-base text-muted-foreground">{schedule.time}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 sm:p-8 h-full bg-card border-border/50">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">Ubicación</h3>
                </div>
                {locations.map((location, index) => (
                  <div key={index} className="space-y-3 sm:space-y-4">
                    <div>
                      <h4 className="font-bold text-base sm:text-lg mb-2 text-foreground">{location.name}</h4>
                      <p className="text-sm sm:text-base text-muted-foreground">{location.address}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm sm:text-base text-foreground">Teléfono:</span>
                        <a href={`tel:${location.phone}`} className="text-sm sm:text-base text-primary hover:underline">
                          {location.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm sm:text-base text-foreground">Email:</span>
                        <a href={`mailto:${location.email}`} className="text-sm sm:text-base text-primary hover:underline">
                          {location.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { number: '40+', label: 'Años de experiencia' },
              { number: '500+', label: 'Eventos realizados' },
              { number: '50+', label: 'Platillos en menú' },
              { number: '98%', label: 'Clientes satisfechos' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 sm:p-6 lg:p-8 text-center bg-gradient-warm text-white border-none">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">{stat.number}</div>
                  <p className="text-xs sm:text-sm lg:text-base text-white/90">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
