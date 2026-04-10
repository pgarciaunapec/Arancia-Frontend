import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import { validateWithYup } from "../lib/forms/yupTanstack";
import { contactSchema } from "../schemas/forms.schema";
import { TanstackFormInput } from "../components/forms/TanstackFormInput";
import { TanstackFormTextarea } from "../components/forms/TanstackFormTextarea";
import { TanstackFormSelect } from "../components/forms/TanstackFormSelect";

interface ContactProps {
  onShowModal: (title: string, message: string) => void;
}

const Contact: React.FC<ContactProps> = ({ onShowModal }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const didPrefillRef = useRef(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "Consulta general",
      message: "",
    },
    validators: {
      onChange: ({ value }) => validateWithYup(contactSchema, value),
      onSubmit: ({ value }) => validateWithYup(contactSchema, value),
    },
    onSubmitInvalid: () => {
      setError("Revisa los campos marcados antes de enviar tu mensaje.");
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      setError("");

      try {
        await apiRequest("/contact", {
          method: "POST",
          body: JSON.stringify(value),
        });

        onShowModal(
          "¡Mensaje Enviado!",
          "Gracias por contactarnos. Te responderemos pronto.",
        );
        form.reset();

        if (isAuthenticated && user) {
          form.setFieldValue("name", user.name || "");
          form.setFieldValue("email", user.email || "");
          form.setFieldValue("phone", user.phone || "");
        }
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "No se pudo enviar el mensaje",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      didPrefillRef.current = false;
      return;
    }

    if (didPrefillRef.current) {
      return;
    }

    form.setFieldValue("name", user.name || "");
    form.setFieldValue("email", user.email || "");
    form.setFieldValue("phone", user.phone || "");
    didPrefillRef.current = true;
  }, [form, isAuthenticated, user]);

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Teléfono",
      content: "(809) 555-0123",
      link: "tel:+18095550123",
    },
    {
      icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Email",
      content: "info@bobtoronja.com",
      link: "mailto:info@bobtoronja.com",
    },
    {
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Dirección",
      content: "Calle Principal #123, Santa Fe",
      link: "https://maps.google.com",
    },
    {
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Horario",
      content: "Lun-Dom: 12:00 PM - 10:00 PM",
      link: null,
    },
  ];

  return (
    <div className="w-full min-h-full">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden w-full"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1615391532817-b007c4550f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwZ2xhc3NlcyUyMHJlc3RhdXJhbnQlMjBhdG1vc3BoZXJlfGVufDF8fHx8MTc3MDQxNTI3NXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Contact"
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
              📞 Contáctanos
            </Badge>
          </motion.div> */}

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-12 mb-4 sm:mb-6"
          >
            Contacto
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/90 px-4"
          >
            Estamos aquí para atenderte. Contáctanos para reservaciones o
            consultas
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 sm:p-6 text-center hover:shadow-xl transition-all border-border/50 bg-card h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-warm mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white">
                    {info.icon}
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2 text-foreground">
                    {info.title}
                  </h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      target={
                        info.link.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        info.link.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {info.content}
                    </p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 sm:p-8 border-border/50 bg-card h-full">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-foreground">
                  Envíanos un Mensaje
                </h2>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void form.handleSubmit();
                  }}
                  className="space-y-4 sm:space-y-6"
                >
                  <TanstackFormInput
                    form={form}
                    name="name"
                    label="Nombre Completo"
                    type="text"
                    required
                    placeholder="Tu nombre"
                    labelClassName="block mb-2 font-medium text-sm sm:text-base text-foreground"
                    inputClassName="w-full bg-input-background border border-border text-sm sm:text-base py-5 sm:py-6 px-3 rounded-md"
                  />

                  <TanstackFormInput
                    form={form}
                    name="email"
                    label="Email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    labelClassName="block mb-2 font-medium text-sm sm:text-base text-foreground"
                    inputClassName="w-full bg-input-background border border-border text-sm sm:text-base py-5 sm:py-6 px-3 rounded-md"
                  />

                  <TanstackFormInput
                    form={form}
                    name="phone"
                    label="Teléfono"
                    type="tel"
                    placeholder="(809) 555-0123"
                    labelClassName="block mb-2 font-medium text-sm sm:text-base text-foreground"
                    inputClassName="w-full bg-input-background border border-border text-sm sm:text-base py-5 sm:py-6 px-3 rounded-md"
                  />

                  <TanstackFormSelect
                    form={form}
                    name="subject"
                    label="Asunto"
                    required
                    options={[
                      { value: "Consulta general", label: "Consulta general" },
                      { value: "Reserva", label: "Reserva" },
                      { value: "Eventos", label: "Eventos" },
                      { value: "Soporte", label: "Soporte" },
                    ]}
                    labelClassName="block mb-2 font-medium text-sm sm:text-base text-foreground"
                    selectClassName="w-full bg-input-background border border-border text-sm sm:text-base py-4 sm:py-5 px-3 rounded-md"
                  />

                  <TanstackFormTextarea
                    form={form}
                    name="message"
                    label="Mensaje"
                    required
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    labelClassName="block mb-2 font-medium text-sm sm:text-base text-foreground"
                    textareaClassName="w-full bg-input-background border border-border resize-none text-sm sm:text-base px-3 py-2 rounded-md"
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-warm text-white hover:shadow-lg py-5 sm:py-6 rounded-xl transition-all hover:scale-105 text-sm sm:text-base"
                  >
                    <Send className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                  </Button>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
              </Card>
            </motion.div>

            {/* Map/Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 sm:p-8 h-full border-border/50 bg-card">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-foreground">
                  Encuéntranos
                </h2>

                {/* Map Placeholder */}
                <div className="aspect-video bg-muted rounded-xl mb-4 sm:mb-6 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1762928289633-c1565bc92931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc3MDM3MDcwMnww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Location"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg mb-2 text-foreground">
                      Arancia
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Calle Principal #123
                      <br />
                      Santa Fe, República Dominicana
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base text-foreground">
                      Horarios de Atención:
                    </h4>
                    <ul className="text-sm sm:text-base text-muted-foreground space-y-1">
                      <li>Lunes - Jueves: 12:00 PM - 10:00 PM</li>
                      <li>Viernes - Sábado: 12:00 PM - 11:30 PM</li>
                      <li>Domingo: 11:00 AM - 9:00 PM</li>
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-border hover:border-primary/50 text-sm sm:text-base py-5 sm:py-6"
                    asChild
                  >
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                      Ver en Google Maps
                    </a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
