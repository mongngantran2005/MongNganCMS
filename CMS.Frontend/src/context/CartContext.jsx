import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const getCartKey = () => {
  try {
    const info = JSON.parse(localStorage.getItem('customerInfo'));
    return info?.id ? `cart_${info.id}` : 'cart';
  } catch { return 'cart'; }
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(getCartKey())) || [];
    } catch {
      return [];
    }
  });

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(getCartKey(), JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const addToCart = (product, quantity = 1) => {
    const newCart = [...cart];
    const existing = newCart.find((i) => i.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      newCart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      });
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    saveCart(cart.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    saveCart(cart.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const clearCart = () => saveCart([]);

  // Sync tab khác hoặc khi thay đổi tài khoản
  useEffect(() => {
    const handler = () => {
      try {
        setCart(JSON.parse(localStorage.getItem(getCartKey())) || []);
      } catch {}
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart phải được dùng trong CartProvider');
  return ctx;
}

export default CartContext;
