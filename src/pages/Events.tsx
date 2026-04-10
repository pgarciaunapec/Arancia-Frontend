import React, { useState } from "react";
import { motion } from "motion/react";
import {
  PartyPopper,
  Briefcase,
  UtensilsCrossed,
  Music,
  Calendar,
  ArrowRight,
  Phone,
} from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { apiRequest } from "../lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { TanstackFormInput } from "../components/forms/TanstackFormInput";
import { TanstackFormSelect } from "../components/forms/TanstackFormSelect";
import { TanstackFormTextarea } from "../components/forms/TanstackFormTextarea";
import { validateWithYup } from "../lib/forms/yupTanstack";
import { eventQuoteSchema } from "../schemas/forms.schema";

interface EventsPageProps {
  onShowModal: (title: string, message: string) => void;
}

type EventType = "social" | "corporativo" | "privado" | "otro";

const Events: React.FC<EventsPageProps> = ({ onShowModal }) => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);

  const quoteForm = useForm({
    defaultValues: {
      eventType: "social" as EventType,
      packageName: "",
      name: "",
      email: "",
      phone: "",
      guests: "30",
      preferredDate: "",
      notes: "",
    },
    validators: {
      onChange: ({ value }) => validateWithYup(eventQuoteSchema, value),
      onSubmit: ({ value }) => validateWithYup(eventQuoteSchema, value),
    },
    onSubmitInvalid: () => {
      setQuoteError("Revisa los campos marcados antes de enviar la solicitud.");
    },
    onSubmit: async ({ value }) => {
      setQuoteLoading(true);
      setQuoteError("");

      try {
        await apiRequest("/contact/event-quote", {
          method: "POST",
          body: JSON.stringify({
            name: value.name,
            email: value.email,
            phone: value.phone,
            eventType: value.eventType,
            packageName: value.packageName || undefined,
            guests: Number(value.guests),
            preferredDate: value.preferredDate || undefined,
            notes: value.notes || undefined,
          }),
        });

        setQuoteModalOpen(false);
        quoteForm.reset();

        onShowModal(
          "¡Solicitud Recibida!",
          "Tu solicitud fue enviada correctamente. Te contactaremos pronto.",
        );
      } catch (error) {
        setQuoteError(
          error instanceof Error
            ? error.message
            : "No se pudo enviar la solicitud.",
        );
      } finally {
        setQuoteLoading(false);
      }
    },
  });

  const openQuoteModal = (eventType: EventType, packageName?: string) => {
    quoteForm.setFieldValue("eventType", eventType);
    quoteForm.setFieldValue("packageName", packageName || "");
    setQuoteError("");
    setQuoteModalOpen(true);
  };

  const eventTypes = [
    {
      icon: <PartyPopper className="w-8 h-8" />,
      title: "Eventos Sociales",
      description: "Bodas, aniversarios, cumpleaños y celebraciones familiares",
      features: [
        "Menús personalizados",
        "Decoración incluida",
        "Hasta 150 personas",
        "Servicio de bar",
      ],
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Eventos Corporativos",
      description: "Reuniones de negocios, conferencias y cenas empresariales",
      features: [
        "Equipos audiovisuales",
        "Wi-Fi de alta velocidad",
        "Catering ejecutivo",
        "Espacios privados",
      ],
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Menús Personalizados",
      description: "Diseñamos menús especiales adaptados a tus necesidades",
      features: [
        "Opciones veganas",
        "Sin gluten disponible",
        "Chef a la vista",
        "Degustación previa",
      ],
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Ambiente Especial",
      description:
        "Decoración, música y servicio para crear la atmósfera perfecta",
      features: [
        "Música en vivo",
        "Iluminación ambiental",
        "Decoración temática",
        "Fotografía profesional",
      ],
    },
  ];

  const packages = [
    {
      name: "Esencial",
      price: "RD$2,500",
      description: "Perfecto para reuniones íntimas",
      features: [
        "20-40 personas",
        "Menú de 3 tiempos",
        "Decoración básica",
        "Servicio de meseros",
        "4 horas de evento",
      ],
    },
    {
      name: "Premium",
      price: "RD$5,000",
      description: "Ideal para celebraciones especiales",
      features: [
        "40-80 personas",
        "Menú de 4 tiempos",
        "Decoración personalizada",
        "Servicio de bar",
        "Música en vivo",
        "6 horas de evento",
      ],
      featured: true,
    },
    {
      name: "Elite",
      price: "RD$10,000",
      description: "La experiencia completa",
      features: [
        "80-150 personas",
        "Menú gourmet 5 tiempos",
        "Decoración exclusiva",
        "Bar premium",
        "Banda en vivo",
        "Fotografía profesional",
        "8 horas de evento",
      ],
    },
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
          {/* <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-4 sm:mb-6 bg-white/20 backdrop-blur-sm border-white/30 text-white px-4 sm:px-6 py-2 text-xs sm:text-sm">
              🎉 Eventos Especiales
            </Badge>
          </motion.div> */}

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mt-12 mb-4 sm:mb-6"
          >
            Eventos Privados
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-4"
          >
            Celebra momentos especiales en Arancia con espacios privados, menús
            personalizados y un servicio excepcional
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              onClick={() => openQuoteModal("social")}
              className="bg-amber-400 text-slate-900 hover:bg-amber-300 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl shadow-xl hover:scale-105 transition-all font-bold"
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
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">
                    {type.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    {type.description}
                  </p>
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm sm:text-base"
                      >
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
                <Card
                  className={`p-6 sm:p-8 h-full flex flex-col border-border/50 ${
                    pkg.featured
                      ? "bg-gradient-warm text-white shadow-2xl scale-100 lg:scale-105"
                      : "bg-card hover:shadow-xl"
                  } transition-all`}
                >
                  <div className="text-center mb-4 sm:mb-6">
                    <h3
                      className={`text-xl sm:text-2xl font-bold mb-2 ${
                        pkg.featured ? "text-white" : "text-foreground"
                      }`}
                    >
                      {pkg.name}
                    </h3>
                    <div
                      className={`text-3xl sm:text-4xl font-bold mb-2 ${
                        pkg.featured ? "text-white" : "text-primary"
                      }`}
                    >
                      {pkg.price}
                    </div>
                    <p
                      className={`text-xs sm:text-sm ${
                        pkg.featured ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      {pkg.description}
                    </p>
                  </div>

                  <div className="flex-1 mb-4 sm:mb-6">
                    <ul className="space-y-2 sm:space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              pkg.featured ? "bg-white/20" : "bg-primary/10"
                            }`}
                          >
                            <span
                              className={
                                pkg.featured
                                  ? "text-white text-xs"
                                  : "text-primary text-xs"
                              }
                            >
                              ✓
                            </span>
                          </div>
                          <span
                            className={`text-sm sm:text-base ${
                              pkg.featured
                                ? "text-white/90"
                                : "text-muted-foreground"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => openQuoteModal("social", pkg.name)}
                    className={`w-full ${
                      pkg.featured
                        ? "bg-slate-900 text-amber-300 border border-amber-300/70 hover:bg-slate-800"
                        : "bg-amber-400 text-slate-900 hover:bg-amber-300"
                    } py-5 sm:py-6 rounded-xl transition-all hover:scale-105 text-sm sm:text-base font-semibold`}
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-secondary-foreground">
              ¿Listo para Planear Tu Evento?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-secondary-foreground/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Contáctanos para discutir los detalles de tu evento y recibir una
              cotización personalizada. Nuestro equipo está listo para hacer de
              tu celebración una experiencia inolvidable.
            </p>
            <Button
              size="lg"
              onClick={() => openQuoteModal("privado")}
              className="bg-amber-400 text-slate-900 hover:bg-amber-300 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl shadow-xl hover:scale-105 transition-all font-bold"
            >
              <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Contactar Ahora
            </Button>
          </motion.div>
        </div>
      </section>

      <Dialog open={quoteModalOpen} onOpenChange={setQuoteModalOpen}>
        <DialogContent className="bg-slate-900 border border-amber-300/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-300">
              Solicitud de Cotizacion
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Completa estos datos y nuestro equipo te contactara con una
              propuesta personalizada.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void quoteForm.handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TanstackFormSelect
                form={quoteForm}
                name="eventType"
                label="Tipo de Evento"
                required
                options={[
                  { value: "social", label: "Social" },
                  { value: "corporativo", label: "Corporativo" },
                  { value: "privado", label: "Privado" },
                  { value: "otro", label: "Otro" },
                ]}
                labelClassName="text-sm font-medium text-slate-200"
                selectClassName="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white"
              />

              <TanstackFormInput
                form={quoteForm}
                name="packageName"
                label="Paquete"
                placeholder="Ej. Premium"
                labelClassName="text-sm font-medium text-slate-200"
                inputClassName="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TanstackFormInput
                form={quoteForm}
                name="name"
                label="Nombre Completo"
                required
                labelClassName="text-sm font-medium text-slate-200"
                inputClassName="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white"
              />
              <TanstackFormInput
                form={quoteForm}
                name="email"
                label="Correo Electronico"
                type="email"
                required
                labelClassName="text-sm font-medium text-slate-200"
                inputClassName="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white"
              />
              <TanstackFormInput
                form={quoteForm}
                name="phone"
                label="Telefono"
                required
                labelClassName="text-sm font-medium text-slate-200"
                inputClassName="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white"
              />
              <TanstackFormInput
                form={quoteForm}
                name="guests"
                label="Invitados"
                type="number"
                required
                labelClassName="text-sm font-medium text-slate-200"
                inputClassName="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white"
              />
              <TanstackFormInput
                form={quoteForm}
                name="preferredDate"
                label="Fecha Preferida"
                type="date"
                labelClassName="text-sm font-medium text-slate-200"
                inputClassName="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white"
              />
            </div>

            <TanstackFormTextarea
              form={quoteForm}
              name="notes"
              label="Notas"
              placeholder="Cuéntanos detalles del evento"
              rows={4}
              labelClassName="text-sm font-medium text-slate-200"
              textareaClassName="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white"
            />

            {quoteError && (
              <p className="text-sm text-red-300 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2">
                {quoteError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuoteModalOpen(false)}
                className="border-slate-500 text-slate-100 hover:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={quoteLoading}
                className="bg-amber-400 text-slate-900 hover:bg-amber-300"
              >
                {quoteLoading ? "Enviando..." : "Enviar Solicitud"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
