import { useState, useEffect, useCallback } from 'react';

/**
 * useCart - Hook quản lý giỏ hàng từ localStorage
 */
function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  // Sync với tab khác
  useEffect(() => {
    const handler = () => {
      setCart(JSON.parse(localStorage.getItem('cart')) || []);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const addToCart = useCallback((product, quantity = 1) => {
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
  }, [cart]);

  const removeFromCart = useCallback((productId) => {
    saveCart(cart.filter((i) => i.productId !== productId));
  }, [cart]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    const newCart = cart.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    saveCart(newCart);
  }, [cart]);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice };
}

export { useCart };
