import React, { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  Star,
  ShoppingBag,
  Calendar,
  LogOut,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useReservations } from "../context/ReservationsContext";
import { useNavigate, Link } from "react-router-dom";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { getOrdersByUser } = useOrders();
  const { getReservationsByUser } = useReservations();
  const navigate = useNavigate();

  const userOrders = user ? getOrdersByUser(user.id) : [];
  const userReservations = user ? getReservationsByUser(user.id) : [];

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    const result = await updateProfile(formData);
    if (!result.success) {
      setProfileError(result.error || "No se pudo actualizar el perfil.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePasswordUpdate = async () => {
    setPasswordError("");

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError("Completa todos los campos de contraseña.");
      return;
    }

    if (passwords.new.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError("La confirmación no coincide con la nueva contraseña.");
      return;
    }

    const result = await changePassword(passwords.current, passwords.new);
    if (!result.success) {
      setPasswordError(result.error || "No se pudo cambiar la contraseña.");
      return;
    }

    setPasswords({ current: "", new: "", confirm: "" });
    setPasswordError("");
    window.alert("Contraseña actualizada correctamente.");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-4xl text-primary font-bold"
                style={{
                  backgroundColor: "rgba(245,180,0,0.2)",
                  color: COLORS.primary,
                }}
              >
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">
                    {user?.name}
                  </h1>
                  {user?.isVIP && (
                    <span
                      className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(245,180,0,0.2)",
                        color: COLORS.primary,
                      }}
                    >
                      <Star size={12} fill="currentColor" /> VIP
                    </span>
                  )}
                </div>
                <p style={{ color: COLORS.muted }}>{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={16} /> Cerrar Sesión
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              {
                icon: <ShoppingBag size={20} />,
                label: "Pedidos",
                value: userOrders.length,
                link: "/my-orders",
              },
              {
                icon: <Calendar size={20} />,
                label: "Reservas",
                value: userReservations.length,
                link: "/my-reservations",
              },
              {
                icon: <Star size={20} />,
                label: "Puntos",
                value: user?.loyaltyPoints || 0,
                link: "#",
              },
            ].map((stat) => (
              <Link key={stat.label} to={stat.link}>
                <Card
                  className="p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div
                    className="flex justify-center mb-2"
                    style={{ color: COLORS.primary }}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: COLORS.muted }}>
                    {stat.label}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card
            className="p-8 space-y-6"
            style={{
              backgroundColor: COLORS.secondary,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <h3 className="text-xl font-bold mb-4 text-white pb-2 border-b border-white/10">
              Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-white/40"
                    size={18}
                  />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/20 pl-10 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                    style={{ borderColor: COLORS.border }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-white/40"
                    size={18}
                  />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full bg-black/20 pl-10 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                    style={{ borderColor: COLORS.border }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-3 text-white/40"
                    size={18}
                  />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black/20 pl-10 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                    style={{ borderColor: COLORS.border }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Dirección Principal
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-white/40"
                    size={18}
                  />
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-black/20 pl-10 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                    style={{ borderColor: COLORS.border }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                size="lg"
                className="px-8 flex items-center gap-2"
                type="submit"
              >
                {saved ? (
                  "✓ Guardado"
                ) : (
                  <>
                    <Save size={18} /> Guardar Cambios
                  </>
                )}
              </Button>
            </div>
            {profileError && (
              <p className="text-sm text-red-400">{profileError}</p>
            )}
          </Card>

          <Card
            className="p-8 space-y-6 opacity-75 hover:opacity-100 transition-all"
            style={{
              backgroundColor: COLORS.secondary,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <h3 className="text-xl font-bold mb-4 text-white pb-2 border-b border-white/10 flex items-center gap-2">
              <Lock size={20} /> Cambiar Contraseña
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="password"
                placeholder="Contraseña Actual"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                style={{ borderColor: COLORS.border }}
              />
              <input
                type="password"
                placeholder="Nueva Contraseña"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                style={{ borderColor: COLORS.border }}
              />
              <input
                type="password"
                placeholder="Confirmar Nueva Contraseña"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none md:col-span-2"
                style={{ borderColor: COLORS.border }}
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-400">{passwordError}</p>
            )}
            <div className="flex justify-end">
              <Button
                variant="outline"
                type="button"
                className="border-white/20 text-white/60 hover:text-white"
                onClick={handlePasswordUpdate}
              >
                Actualizar Contraseña
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Profile;
