
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { CartItem } from "@/types/marketplace"; // Import CartItem from types

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'id' | 'user_id'>) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'id' | 'user_id'>) => Promise<void>;
}

// Create a local storage key for guest cart
const GUEST_CART_KEY = "battleforge_guest_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  // Function to load cart from local storage for guest users
  const loadGuestCart = useCallback(() => {
    try {
      const savedCart = localStorage.getItem(GUEST_CART_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      }
    } catch (error) {
      console.error("Error loading guest cart from localStorage:", error);
    }
  }, []);

  // Save guest cart to localStorage
  const saveGuestCart = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving guest cart to localStorage:", error);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      if (currentUser) {
        // User is logged in - fetch cart from Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', currentUser.id);

        if (error) {
          throw error;
        }

        setItems(data as CartItem[]);

        // Check if there was a guest cart that needs to be merged
        const guestCart = localStorage.getItem(GUEST_CART_KEY);
        if (guestCart) {
          const guestItems = JSON.parse(guestCart) as CartItem[];
          
          // Merge guest cart with user cart if there are items
          if (guestItems.length > 0) {
            for (const item of guestItems) {
              // Check if item is already in user's cart
              const existingItem = data?.find(i => i.product_id === item.product_id);
              if (!existingItem) {
                await addItem({
                  product_id: item.product_id,
                  product_name: item.product_name,
                  product_type: item.product_type,
                  price: item.price,
                  quantity: item.quantity,
                  details: item.details,
                  configuration: item.configuration
                });
              }
            }
            // Clear guest cart after merging
            localStorage.removeItem(GUEST_CART_KEY);
            toast.success("Your guest cart items have been added to your account");
          }
        }
      } else {
        // User is not logged in - load cart from localStorage
        loadGuestCart();
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, loadGuestCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (item: Omit<CartItem, 'id' | 'user_id'>) => {
    try {
      setIsLoading(true);
      
      // Ensure details is an object, default to empty object if not provided
      const itemDetails = item.details || {};
      
      if (currentUser) {
        // User is logged in - add to Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .insert([{ 
            ...item, 
            user_id: currentUser.id,
            details: itemDetails
          }])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setItems([...items, data as CartItem]);
      } else {
        // User is not logged in - add to local storage
        const guestItem: CartItem = {
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          product_id: item.product_id,
          product_name: item.product_name,
          product_type: item.product_type,
          price: item.price,
          quantity: item.quantity,
          user_id: 'guest', // Set a default user_id for guests
          details: itemDetails,
          configuration: item.configuration
        };
        
        const updatedItems = [...items, guestItem];
        setItems(updatedItems);
        saveGuestCart(updatedItems);
      }
      
      toast.success(`${item.product_name} added to cart!`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error(`Failed to add ${item.product_name} to cart`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setIsLoading(true);
      
      if (currentUser) {
        // User is logged in - update in Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', currentUser.id)
          .eq('product_id', productId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setItems(items.map(item =>
          item.product_id === productId ? { ...item, quantity } : item
        ));
      } else {
        // User is not logged in - update in local storage
        const updatedItems = items.map(item =>
          item.product_id === productId ? { ...item, quantity } : item
        );
        setItems(updatedItems);
        saveGuestCart(updatedItems);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setIsLoading(true);
      
      if (currentUser) {
        // User is logged in - remove from Supabase
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('product_id', productId);

        if (error) {
          throw error;
        }
      }

      // Update local state for both guest and logged-in users
      const updatedItems = items.filter(item => item.product_id !== productId);
      setItems(updatedItems);
      
      // For guest users, also update localStorage
      if (!currentUser) {
        saveGuestCart(updatedItems);
      }
      
      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      
      if (currentUser) {
        // User is logged in - clear cart in Supabase
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', currentUser.id);

        if (error) {
          throw error;
        }
      }

      // Clear local state for both logged-in and guest users
      setItems([]);
      
      // For guest users, also clear localStorage
      if (!currentUser) {
        localStorage.removeItem(GUEST_CART_KEY);
      }
      
      toast.success("Cart cleared successfully.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add an alias for addItem to maintain backwards compatibility
  const addToCart = addItem;

  const value: CartContextType = {
    items,
    isLoading,
    fetchCart,
    addItem,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
