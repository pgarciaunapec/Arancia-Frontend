import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import { cartApi, type Order, type MenuItem } from "../services/api";
import { useAuth } from "./AuthContext";

interface CartItem {
  menuItem: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  isLoading: boolean;
  addItem: (item: MenuItem, quantity?: number) => Promise<void>;
  updateQuantity: (menuItemId: string, quantity: number) => Promise<void>;
  removeItem: (menuItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Local cart for non-authenticated users
  const [localCart, setLocalCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("localCart");
    return saved ? JSON.parse(saved) : [];
  });

  // Save local cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("localCart", JSON.stringify(localCart));
    }
  }, [localCart, isAuthenticated]);

  // Fetch cart from server when authenticated, merge local cart
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      // Merge local cart items into server cart
      const pendingItems = [...localCart];
      if (pendingItems.length > 0) {
        for (const item of pendingItems) {
          try {
            await cartApi.addItem(item.menuItem, item.quantity);
          } catch {
            // Item may no longer exist, skip
          }
        }
        setLocalCart([]);
        localStorage.removeItem("localCart");
      }

      const response = await cartApi.get();
      if (response.data) {
        setCart(response.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, localCart]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, refreshCart]);

  // Calculate totals for local cart
  const calculateLocalTotals = useCallback(() => {
    const subtotal = localCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.18;
    return { subtotal, tax, total: subtotal + tax };
  }, [localCart]);

  const addItem = useCallback(
    async (item: MenuItem, quantity: number = 1) => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const response = await cartApi.addItem(item._id, quantity);
          if (response.data) {
            setCart(response.data);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setLocalCart((prev) => {
          const existingIndex = prev.findIndex((i) => i.menuItem === item._id);
          if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex].quantity += quantity;
            return updated;
          }
          return [
            ...prev,
            {
              menuItem: item._id,
              name: item.name,
              quantity,
              price: item.price,
              image: item.image,
            },
          ];
        });
      }
    },
    [isAuthenticated],
  );

  const updateQuantity = useCallback(
    async (menuItemId: string, quantity: number) => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const response = await cartApi.updateQuantity(menuItemId, quantity);
          if (response.data) {
            setCart(response.data);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setLocalCart((prev) =>
          prev.map((item) =>
            item.menuItem === menuItemId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        );
      }
    },
    [isAuthenticated],
  );

  const removeItem = useCallback(
    async (menuItemId: string) => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const response = await cartApi.removeItem(menuItemId);
          if (response.data) {
            setCart(response.data);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setLocalCart((prev) =>
          prev.filter((item) => item.menuItem !== menuItemId),
        );
      }
    },
    [isAuthenticated],
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const response = await cartApi.clear();
        if (response.data) {
          setCart(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setLocalCart([]);
    }
  }, [isAuthenticated]);

  // Compute values based on auth state
  const items = isAuthenticated ? cart?.items || [] : localCart;
  const localTotals = calculateLocalTotals();

  const value: CartContextType = {
    items,
    subtotal: isAuthenticated ? cart?.subtotal || 0 : localTotals.subtotal,
    tax: isAuthenticated ? cart?.tax || 0 : localTotals.tax,
    total: isAuthenticated ? cart?.total || 0 : localTotals.total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
