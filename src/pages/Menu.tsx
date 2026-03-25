import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Filter, ShoppingBag } from 'lucide-react';
import type { MenuItem } from '../types';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useCart } from '../context/CartContext';
import { apiRequest } from '../lib/api';
import type { ApiEnvelope } from '../lib/api';
import { mapBackendMenuItem } from '../lib/mappers';

interface MenuPageProps {
  onShowModal: (title: string, message: string) => void;
}

const Menu: React.FC<MenuPageProps> = ({ onShowModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { addItem, items: cartItems } = useCart();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await apiRequest<ApiEnvelope<any[]>>('/menu');
        setMenuItems((response.data || []).map(mapBackendMenuItem));
      } catch {
        setMenuItems([]);
      }
    };

    loadMenu();
  }, []);

  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map(item => item.category)));
    return ['all', ...cats];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    let items = selectedCategory === 'all'
      ? [...menuItems]
      : menuItems.filter(item => item.category === selectedCategory);

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return items;
  }, [selectedCategory, searchQuery]);

  const getCartQty = (itemId: string) => {
    const found = cartItems.find(i => i.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleAddItem = (item: MenuItem) => {
    addItem(item);
    onShowModal('¡Agregado!', `${item.name} ha sido agregado a tu carrito`);
  };

  return (
    <div className="w-full min-h-full">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            {/* <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary/20">
              🍽️ Menú Online
            </Badge> */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-18 mb-3 sm:mb-4 text-foreground"
            >
              Nuestro Menú
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
            >
              Descubre nuestra selección de platillos preparados con ingredientes frescos y de la más alta calidad
            </motion.p>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 sm:p-6 bg-card border-border/50">
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar platillos o ingredientes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-10 py-5 sm:py-6 bg-input-background border-border rounded-lg text-sm sm:text-base"
                  />
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-4 sm:px-6 py-5 sm:py-6 border-border rounded-lg"
                >
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Filtros</span>
                </Button>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {allCategories.map(cat => (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    className={`rounded-full px-3 sm:px-4 lg:px-6 py-2 transition-all text-xs sm:text-sm ${selectedCategory === cat
                      ? 'bg-gradient-warm text-white shadow-md hover:shadow-lg'
                      : 'border-border hover:border-primary/50'
                      }`}
                  >
                    {cat === 'all' ? 'Todos' : cat}
                  </Button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Mostrando <span className="font-semibold text-foreground">{filteredItems.length}</span> platillos
                  {selectedCategory !== 'all' && ` en ${selectedCategory}`}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 lg:pb-12">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 sm:py-20"
            >
              <p className="text-lg sm:text-xl text-muted-foreground">
                No se encontraron platillos que coincidan con tu búsqueda
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden group hover:shadow-xl transition-all border-border/50 h-full flex flex-col">
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                        <Badge className="bg-accent text-accent-foreground shadow-lg text-xs sm:text-sm">
                          RD${item.price}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>

                      <div className="mb-3 sm:mb-4 flex-1">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                          Ingredientes:
                        </p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {item.ingredients.slice(0, 4).map((ing, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs border-border bg-muted/50"
                            >
                              {ing}
                            </Badge>
                          ))}
                          {item.ingredients.length > 4 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-border bg-muted/50"
                            >
                              +{item.ingredients.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleAddItem(item)}
                        className="w-full bg-gradient-warm text-white hover:shadow-lg transition-all group-hover:scale-105 text-sm sm:text-base py-5 flex items-center justify-center gap-2"
                      >
                        {getCartQty(item.id) > 0 ? (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            En carrito ({getCartQty(item.id)}) · Agregar
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Agregar al Carrito
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;