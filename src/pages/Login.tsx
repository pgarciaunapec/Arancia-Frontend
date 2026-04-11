import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, LogIn, UtensilsCrossed, Eye, EyeOff } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { validateWithYup } from "../lib/forms/yupTanstack";
import { loginSchema } from "../schemas/forms.schema";
import { TanstackFormInput } from "../components/forms/TanstackFormInput";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const navigationState = location.state as
    | { from?: { pathname: string }; message?: string }
    | undefined;
  const from = navigationState?.from?.pathname || "/";
  const redirectMessage = navigationState?.message;

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: ({ value }) => validateWithYup(loginSchema, value),
      onSubmit: ({ value }) => validateWithYup(loginSchema, value),
    },
    onSubmitInvalid: () => {
      setError("Por favor, completa todos los campos.");
    },
    onSubmit: async ({ value }) => {
      setError("");
      setLoading(true);

      const result = await login(value.email, value.password);

      setLoading(false);
      if (result.success) {
        navigate(from, { replace: true });
        return;
      }

      setError(result.error || "El correo o la contraseña no coinciden.");
    },
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 bg-background pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: COLORS.primary }}
          >
            <UtensilsCrossed size={28} style={{ color: COLORS.secondary }} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
          <p style={{ color: COLORS.muted }}>
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {redirectMessage && (
          <div className="mb-4 rounded-lg border border-blue-400/40 bg-blue-400/10 p-3 text-sm text-blue-200">
            {redirectMessage}
          </div>
        )}

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
            {/* Email */}
            <TanstackFormInput
              form={form}
              name="email"
              label="Correo Electrónico"
              type="email"
              placeholder="tu@correo.com"
              autoComplete="email"
              leftIcon={<Mail size={18} />}
              inputClassName="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none transition-all"
              inputStyle={{ borderColor: COLORS.border }}
              labelClassName="text-sm font-medium text-white/80"
            />

            {/* Password */}
            <TanstackFormInput
              form={form}
              name="password"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
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
              inputClassName="w-full bg-black/20 pl-10 pr-12 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none transition-all"
              inputStyle={{ borderColor: COLORS.border }}
              labelClassName="text-sm font-medium text-white/80"
            />

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
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
                  <LogIn size={18} />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: COLORS.muted }} className="text-sm">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="font-medium hover:underline"
                style={{ color: COLORS.primary }}
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
