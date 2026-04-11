import React, { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Plus,
  Minus,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import type { MenuItem } from "../types";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { useCart } from "../context/CartContext";
import { apiRequest } from "../lib/api";
import type { ApiEnvelope } from "../lib/api";
import { getImageUrl } from "../services/api";
import { mapBackendMenuItem } from "../lib/mappers";

interface MenuPageProps {
  onShowModal: (title: string, message: string) => void;
}

type PriceRange = "all" | "under-500" | "500-900" | "900-1400" | "over-1400";

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: "all", label: "Todos los precios" },
  { value: "under-500", label: "Menos de RD$500" },
  { value: "500-900", label: "RD$500 a RD$900" },
  { value: "900-1400", label: "RD$900 a RD$1,400" },
  { value: "over-1400", label: "Más de RD$1,400" },
];

const matchesPriceRange = (price: number, range: PriceRange) => {
  if (range === "all") return true;
  if (range === "under-500") return price < 500;
  if (range === "500-900") return price >= 500 && price <= 900;
  if (range === "900-1400") return price > 900 && price <= 1400;
  return price > 1400;
};

const Menu: React.FC<MenuPageProps> = ({ onShowModal }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] =
    useState<PriceRange>("all");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [popularOnly, setPopularOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { addItem, updateQuantity, items: cartItems } = useCart();

  useEffect(() => {
    const loadMenu = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest<ApiEnvelope<any[]>>("/menu");

        // Backend sometimes wraps the payload as { data: { count, data: [...] } }
        // or returns the array directly as `data`. Handle both shapes defensively.
        const rawPayload = response?.data;
        let itemsArray: any[] = [];

        if (Array.isArray(rawPayload)) {
          itemsArray = rawPayload;
        } else if (rawPayload && Array.isArray((rawPayload as any).data)) {
          itemsArray = (rawPayload as any).data;
        } else {
          itemsArray = [];
        }

        setMenuItems(itemsArray.map(mapBackendMenuItem));
      } catch (err) {
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, []);

  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((item) => item.category)));
    return ["all", ...cats];
  }, [menuItems]);

  const popularItemIds = useMemo(() => {
    const sortedByPrice = [...menuItems].sort((a, b) => b.price - a.price);
    const threshold = Math.max(3, Math.ceil(sortedByPrice.length * 0.25));
    return new Set(sortedByPrice.slice(0, threshold).map((item) => item.id));
  }, [menuItems]);

  const ingredientOptions = useMemo(() => {
    const frequency = new Map<string, number>();

    for (const item of menuItems) {
      for (const ingredient of item.ingredients) {
        const normalized = ingredient.trim();
        if (!normalized) continue;
        frequency.set(normalized, (frequency.get(normalized) || 0) + 1);
      }
    }

    return [...frequency.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 16)
      .map(([ingredient]) => ingredient);
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    let items =
      selectedCategory === "all"
        ? [...menuItems]
        : menuItems.filter((item) => item.category === selectedCategory);

    items = items.filter((item) => matchesPriceRange(item.price, selectedPriceRange));

    if (selectedIngredients.length > 0) {
      items = items.filter((item) =>
        selectedIngredients.every((selected) =>
          item.ingredients.some(
            (ingredient) => ingredient.toLowerCase() === selected.toLowerCase(),
          ),
        ),
      );
    }

    if (popularOnly) {
      items = items.filter((item) => popularItemIds.has(item.id));
    }

    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.ingredients.some((ing) =>
            ing.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    return items;
  }, [
    menuItems,
    popularItemIds,
    popularOnly,
    searchQuery,
    selectedCategory,
    selectedIngredients,
    selectedPriceRange,
  ]);

  const getCartQty = (itemId: string) => {
    const found = cartItems.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((previous) =>
      previous.includes(ingredient)
        ? previous.filter((value) => value !== ingredient)
        : [...previous, ingredient],
    );
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setSelectedIngredients([]);
    setPopularOnly(false);
  };

  const toggleDetails = (itemId: string) => {
    setExpandedItems((previous) =>
      previous.includes(itemId)
        ? previous.filter((value) => value !== itemId)
        : [...previous, itemId],
    );
  };

  const handleAddItem = (item: MenuItem) => {
    addItem(item);
    onShowModal("¡Agregado!", `${item.name} ha sido agregado a tu carrito`);
  };

  const increaseQuantity = (item: MenuItem) => {
    const current = getCartQty(item.id);
    if (current === 0) {
      handleAddItem(item);
      return;
    }

    updateQuantity(item.id, current + 1);
  };

  const decreaseQuantity = (itemId: string) => {
    const current = getCartQty(itemId);
    if (current === 0) {
      return;
    }

    updateQuantity(itemId, current - 1);
  };

  const getItemDescription = (item: MenuItem) => {
    if (item.description && item.description.trim().length > 0) {
      return item.description;
    }

    if (item.ingredients.length === 0) {
      return "Especialidad de la casa preparada al momento por nuestro equipo.";
    }

    return `Preparado con ${item.ingredients.slice(0, 3).join(", ")} y terminado con el sello de Arancia.`;
  };

  return (
    <div className="w-full min-h-full bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center mb-2">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-18 mb-3 text-foreground"
            >
              Menú Arancia
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              Navega por categorías, ajusta filtros en tiempo real y descubre los
              platos más buscados con una experiencia tipo marketplace.
            </motion.p>
          </div>

          <Card className="p-4 sm:p-5 bg-card border-border/50">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar por plato o ingrediente..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-9 py-5 bg-input-background border-border rounded-lg"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="lg:hidden flex items-center gap-2"
                onClick={() => setShowMobileFilters((previous) => !previous)}
              >
                {showMobileFilters ? <X size={16} /> : <SlidersHorizontal size={16} />}
                {showMobileFilters ? "Cerrar filtros" : "Abrir filtros"}
              </Button>

              <div className="text-sm text-muted-foreground md:text-right">
                <span className="font-semibold text-foreground">{filteredItems.length}</span> resultados
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-6">
            <aside className={`${showMobileFilters ? "block" : "hidden"} lg:block`}>
              <Card className="p-5 bg-card border-border/50 lg:sticky lg:top-28 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-foreground">Filtros</h3>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Limpiar
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Categorías
                  </p>
                  <div className="space-y-2">
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {category === "all" ? "Todas" : category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Precio
                  </p>
                  <div className="space-y-2">
                    {PRICE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="priceRange"
                          value={option.value}
                          checked={selectedPriceRange === option.value}
                          onChange={() => setSelectedPriceRange(option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Ingredientes
                  </p>
                  <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                    {ingredientOptions.map((ingredient) => (
                      <label
                        key={ingredient}
                        className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedIngredients.includes(ingredient)}
                          onChange={() => toggleIngredient(ingredient)}
                        />
                        <span>{ingredient}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={popularOnly}
                      onChange={() => setPopularOnly((previous) => !previous)}
                    />
                    <Star size={14} className="text-primary" />
                    Solo populares
                  </label>
                </div>
              </Card>
            </aside>

            <section className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== "all" && (
                  <Badge className="bg-primary/15 text-primary border border-primary/30">
                    Categoría: {selectedCategory}
                  </Badge>
                )}
                {selectedPriceRange !== "all" && (
                  <Badge className="bg-primary/15 text-primary border border-primary/30">
                    {PRICE_OPTIONS.find((option) => option.value === selectedPriceRange)?.label}
                  </Badge>
                )}
                {popularOnly && (
                  <Badge className="bg-primary/15 text-primary border border-primary/30">
                    Populares
                  </Badge>
                )}
                {selectedIngredients.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    className="bg-primary/15 text-primary border border-primary/30"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-72 rounded-2xl border border-border/50 bg-muted/40 animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-lg text-muted-foreground">
                    No encontramos platos con esta combinación de filtros.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      {(() => {
                        const quantity = getCartQty(item.id);
                        const isExpanded = expandedItems.includes(item.id);

                        return (
                      <Card className="overflow-hidden group hover:shadow-xl transition-all border-border/50 h-full flex flex-col">
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(event) => {
                              (event.target as HTMLImageElement).src =
                                "https://placehold.co/600x400?text=No+Image";
                            }}
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            {popularItemIds.has(item.id) && (
                              <Badge className="bg-primary text-primary-foreground">
                                Popular
                              </Badge>
                            )}
                            {quantity > 0 && (
                              <Badge className="bg-white text-slate-900 border border-white/50">
                                {quantity} en pedido
                              </Badge>
                            )}
                            <Badge className="bg-black/70 text-white border border-white/20">
                              RD${item.price}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                              {item.category}
                            </p>
                            <h3 className="text-xl font-bold text-foreground mt-1">
                              {item.name}
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {item.ingredients.slice(0, 4).map((ingredient) => (
                              <Badge
                                key={ingredient}
                                variant="outline"
                                className="text-xs border-border bg-muted/50"
                              >
                                {ingredient}
                              </Badge>
                            ))}
                            {item.ingredients.length > 4 && (
                              <Badge variant="outline" className="text-xs border-border bg-muted/50">
                                +{item.ingredients.length - 4}
                              </Badge>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleDetails(item.id)}
                            className="w-full text-left mt-1 text-sm font-medium text-primary hover:text-primary/80 flex items-center justify-between"
                          >
                            <span>{isExpanded ? "Ocultar detalles" : "Ver detalles"}</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>

                          {isExpanded && (
                            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground space-y-2">
                              <p>{getItemDescription(item)}</p>
                              <p className="text-xs uppercase tracking-wide font-semibold text-foreground/80">
                                Ingredientes completos
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {item.ingredients.map((ingredient) => (
                                  <Badge
                                    key={`${item.id}-${ingredient}`}
                                    variant="outline"
                                    className="text-xs border-border"
                                  >
                                    {ingredient}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-auto rounded-xl border border-border bg-muted/25 p-2 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={quantity === 0}
                              className="h-10 w-10 rounded-lg bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              <Minus size={16} />
                            </button>

                            <div className="text-center min-w-24">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Cantidad
                              </p>
                              <p className="font-bold text-lg text-foreground">{quantity}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item)}
                              className="h-10 w-10 rounded-lg bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center"
                            >
                              {quantity === 0 ? <Plus size={16} /> : <ShoppingBag size={16} />}
                            </button>
                          </div>
                        </div>
                      </Card>
                        );
                      })()}
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
