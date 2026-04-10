import React from "react";
import { motion } from "motion/react";
import { Award, Heart, Users, Target } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const About: React.FC = () => {
  const values = [
    {
      icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Excelencia",
      description:
        "Compromiso constante con la calidad en cada detalle de nuestro servicio",
    },
    {
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Pasión",
      description:
        "Amor por la gastronomía y dedicación en cada platillo que servimos",
    },
    {
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Comunidad",
      description: "Parte integral de la familia gastronómica de Santa Fe",
    },
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Innovación",
      description:
        "Equilibrio perfecto entre tradición y técnicas contemporáneas",
    },
  ];

  const timeline = [
    {
      year: "1984",
      title: "Los Inicios",
      description:
        "Arancia abre sus puertas con la visión de crear un espacio donde la buena mesa y la hospitalidad se encuentren",
    },
    {
      year: "1995",
      title: "Expansión",
      description:
        "Renovamos nuestras instalaciones manteniendo la esencia que nos caracteriza",
    },
    {
      year: "2010",
      title: "Reconocimiento",
      description:
        "Nos consolidamos como referente de la gastronomía regional en Santa Fe",
    },
    {
      year: "2026",
      title: "Hoy",
      description:
        "Más de 40 años siendo parte de las historias y celebraciones de nuestra comunidad",
    },
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
            src="https://images.unsplash.com/photo-1512149519538-136d1b8c574a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnQlMjBraXRjaGVufGVufDF8fHx8MTc3MDQwNjU1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="About Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full">
          {/* <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-4 sm:mb-6 bg-primary/20 backdrop-blur-sm border-primary/30 text-primary-foreground px-4 sm:px-6 py-2 text-xs sm:text-sm">
              ✨ Nuestra Historia
            </Badge>
          </motion.div> */}

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-6 mb-4 sm:mb-6"
          >
            Sobre Nosotros
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed"
          >
            Más de 40 años de excelencia gastronómica y tradición
          </motion.p>
        </div>
      </motion.section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 w-full">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground text-center">
              Nuestra Historia
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground text-center max-w-3xl mx-auto">
              Tradición, técnica y hospitalidad en equilibrio: así se construye
              la experiencia Arancia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 rounded-2xl border border-border/50 bg-card p-6 sm:p-8"
            >
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Durante más de cuatro décadas, Arancia ha sido sinónimo de
                excelencia gastronómica en Rabo Duro. Nuestra pasión por la
                hospitalidad y la tradición se refleja en cada plato que
                servimos. Combinamos técnicas culinarias contemporáneas con
                ingredientes locales de alta calidad, creando experiencias
                memorables para nuestros comensales.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { label: "Años", value: "40+" },
                  { label: "Clientes", value: "18k" },
                  { label: "Eventos", value: "1.2k" },
                  { label: "Reseñas", value: "4.8/5" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-muted/40 px-3 py-4 text-center"
                  >
                    <p className="text-xl font-bold text-foreground">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 rounded-2xl overflow-hidden min-h-[280px]"
            >
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
                alt="Cocina y servicio de Arancia"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="space-y-6 sm:space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 sm:p-6 border-l-4 border-l-primary hover:shadow-lg transition-all bg-card border-border/50">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <Badge className="bg-gradient-warm text-white w-fit px-3 sm:px-4 py-1.5 sm:py-2 text-base sm:text-lg">
                      {item.year}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
              Nuestros Valores
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Los principios que guían nuestro compromiso con la excelencia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 sm:p-6 h-full hover:shadow-xl transition-all border-border/50 bg-card">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-warm mb-3 sm:mb-4 flex items-center justify-center text-white">
                    {value.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 sm:p-8 h-full bg-gradient-warm text-white border-none">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🍽️</div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                  Nuestra Misión
                </h3>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                  Brindar una experiencia gastronómica excepcional que combine
                  la riqueza de la cocina tradicional dominicana con toques
                  contemporáneos, ofreciendo servicios de alta calidad en un
                  ambiente acogedor que celebre nuestra cultura y hospitalidad.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 sm:p-8 h-full bg-secondary text-secondary-foreground border-none">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">⭐</div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                  Nuestra Visión
                </h3>
                <p className="text-sm sm:text-base text-secondary-foreground/90 leading-relaxed">
                  Ser reconocidos como el referente de la gastronomía dominicana
                  en Santa Fe, preservando nuestras raíces culturales mientras
                  continuamos innovando y superando las expectativas de nuestros
                  clientes con cada visita.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Gallery Preview */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-muted/30 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
              Nuestro Espacio
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
              Un ambiente elegante y acogedor diseñado para experiencias
              memorables
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              "https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5nfGVufDF8fHx8MTc3MDM1ODQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
              "https://images.unsplash.com/photo-1758977404304-30ff5f68753c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBzZXR0aW5nJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzAzMzA4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
              "https://images.unsplash.com/photo-1710983165044-0cc32d1aab4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjBjb2xvcmZ1bCUyMGRpc2hlc3xlbnwxfHx8fDE3NzA0MjAxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
            ].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative h-48 sm:h-64 lg:h-80 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
