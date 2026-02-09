import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    white: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)'
};

// Mock data
const INITIAL_CART_ITEMS = [
    { id: 1, name: 'Risotto de Setas', price: 24.00, quantity: 1, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Salmón a la Parrilla', price: 32.00, quantity: 2, image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'Tiramisú Clásico', price: 12.00, quantity: 1, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=200' },
];

const Cart: React.FC = () => {
    const [items, setItems] = React.useState(INITIAL_CART_ITEMS);

    const updateQuantity = (id: number, change: number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    return (
        <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8" style={{ color: COLORS.primary }} />
                        Tu Pedido
                    </h1>
                    <p style={{ color: COLORS.muted }}>Revisa tus platos seleccionados antes de confirmar.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.length === 0 ? (
                            <Card className="p-12 text-center border-dashed" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: COLORS.border }}>
                                <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: COLORS.white }} />
                                <h3 className="text-xl font-medium text-white mb-4">Tu carrito está vacío</h3>
                                <Button asChild>
                                    <Link to="/menu">Explorar Menú</Link>
                                </Button>
                            </Card>
                        ) : (
                            items.map((item) => (
                                <motion.div layout key={item.id}>
                                    <Card className="p-4 flex gap-4 items-center" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                                        <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />

                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-white mb-1">{item.name}</h3>
                                            <p className="text-sm font-medium" style={{ color: COLORS.primary }}>${item.price.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-2 hover:bg-white/10 rounded-md transition-colors text-white"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-bold text-white w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-2 hover:bg-white/10 rounded-md transition-colors text-white"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-3 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors ml-2"
                                            style={{ color: COLORS.muted }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-28" style={{ backgroundColor: '#1a1a1a', border: `2px solid ${COLORS.primary}` }}>
                            <h3 className="text-xl font-bold mb-6 text-white pb-4 border-b border-white/10">Resumen</h3>

                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between text-white/80">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/80">
                                    <span>Impuestos (18%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-white/10">
                                    <span>Total</span>
                                    <span style={{ color: COLORS.primary }}>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button size="lg" className="w-full text-base" asChild disabled={items.length === 0}>
                                <Link to="/checkout">
                                    Proceder al Pago
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>

                            <p className="text-xs text-center mt-4 opacity-50 text-white">
                                Pagos seguros encriptados SSL
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
