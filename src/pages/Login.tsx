import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, register, isLoading: authLoading } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isLoginMode) {
                await login(formData.email, formData.password);
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Las contraseñas no coinciden');
                    setIsLoading(false);
                    return;
                }
                await register(formData.name, formData.email, formData.password);
            }
            navigate('/menu');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4 py-20 bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Link
                    to="/"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al inicio
                </Link>

                <Card className="p-6 sm:p-8 bg-card border-border">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                            {isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {isLoginMode
                                ? 'Ingresa tus credenciales para continuar'
                                : 'Completa el formulario para registrarte'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLoginMode && (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Nombre
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Tu nombre completo"
                                        className="pl-10"
                                        required={!isLoginMode}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="tu@email.com"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="pl-10"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {!isLoginMode && (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="pl-10"
                                        required={!isLoginMode}
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-warm text-white"
                            disabled={isLoading || authLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {isLoginMode ? 'Iniciando...' : 'Registrando...'}
                                </>
                            ) : (
                                isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setError(null);
                            }}
                            className="text-sm text-primary hover:underline"
                        >
                            {isLoginMode
                                ? '¿No tienes cuenta? Regístrate'
                                : '¿Ya tienes cuenta? Inicia sesión'}
                        </button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
