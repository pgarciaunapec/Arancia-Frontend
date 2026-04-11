import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Lock,
  Phone,
  UserPlus,
  UtensilsCrossed,
  Eye,
  EyeOff,
} from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { validateWithYup } from "../lib/forms/yupTanstack";
import { registerSchema } from "../schemas/forms.schema";
import { TanstackFormInput } from "../components/forms/TanstackFormInput";
import { formatDominicanPhoneInput } from "../lib/phone";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: ({ value }) => validateWithYup(registerSchema, value),
      onSubmit: ({ value }) => validateWithYup(registerSchema, value),
    },
    onSubmitInvalid: () => {
      setError("Revisa los campos marcados antes de continuar.");
    },
    onSubmit: async ({ value }) => {
      setError("");
      setLoading(true);

      const result = await register({
        name: value.name,
        email: value.email,
        phone: value.phone,
        password: value.password,
      });

      setLoading(false);
      if (result.success) {
        navigate("/");
        return;
      }

      setError(result.error || "Error al registrarse");
    },
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 bg-background pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: COLORS.primary }}
          >
            <UtensilsCrossed size={28} style={{ color: COLORS.secondary }} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p style={{ color: COLORS.muted }}>
            Únete y disfruta de todos los beneficios
          </p>
        </div>

        <Card
          className="p-8"
          style={{
            backgroundColor: COLORS.secondary,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
            className="space-y-5"
          >
            <TanstackFormInput
              form={form}
              name="name"
              label="Nombre Completo *"
              type="text"
              placeholder="Tu nombre"
              leftIcon={<User size={18} />}
              inputClassName="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
              inputStyle={{ borderColor: COLORS.border }}
              labelClassName="text-sm font-medium text-white/80"
            />

            <TanstackFormInput
              form={form}
              name="email"
              label="Correo Electrónico *"
              type="email"
              placeholder="tu@correo.com"
              autoComplete="email"
              leftIcon={<Mail size={18} />}
              inputClassName="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
              inputStyle={{ borderColor: COLORS.border }}
              labelClassName="text-sm font-medium text-white/80"
            />

            <TanstackFormInput
              form={form}
              name="phone"
              label="Teléfono"
              type="tel"
              placeholder="+1 (809) 000-0000"
              autoComplete="tel"
              transformOnChange={formatDominicanPhoneInput}
              leftIcon={<Phone size={18} />}
              inputClassName="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
              inputStyle={{ borderColor: COLORS.border }}
              labelClassName="text-sm font-medium text-white/80"
            />

            <TanstackFormInput
              form={form}
              name="password"
              label="Contraseña *"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              leftIcon={<Lock size={18} />}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              inputClassName="w-full bg-black/20 pl-10 pr-12 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
              inputStyle={{ borderColor: COLORS.border }}
              labelClassName="text-sm font-medium text-white/80"
            />

            <TanstackFormInput
              form={form}
              name="confirmPassword"
              label="Confirmar Contraseña *"
              type={showPassword ? "text" : "password"}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              leftIcon={<Lock size={18} />}
              inputClassName="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
              inputStyle={{ borderColor: COLORS.border }}
              labelClassName="text-sm font-medium text-white/80"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Crear Cuenta
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: COLORS.muted }} className="text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="font-medium hover:underline"
                style={{ color: COLORS.primary }}
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
