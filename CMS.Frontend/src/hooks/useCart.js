import { useState, useEffect, useCallback } from 'react';

const getIsLoggedIn = () => {
  try {
    const info = JSON.parse(localStorage.getItem('customerInfo'));
    return !!info?.id;
  } catch {
    return false;
  }
};

const getCartKey = () => {
  try {
    const info = JSON.parse(localStorage.getItem('customerInfo'));
    return info?.id ? `cart_${info.id}` : 'cart';
  } catch {
    return 'cart';
  }
};

/**
 * useCart - Hook quản lý giỏ hàng từ localStorage
 */
function useCart() {
  const [cart, setCart] = useState(() => {
    if (!getIsLoggedIn()) return [];
    try {
      return JSON.parse(localStorage.getItem(getCartKey())) || [];
    } catch {
      return [];
    }
  });

  // Sync với tab khác hoặc khi đổi tài khoản
  useEffect(() => {
    const handler = () => {
      if (!getIsLoggedIn()) {
        setCart([]);
      } else {
        setCart(JSON.parse(localStorage.getItem(getCartKey())) || []);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const saveCart = (newCart) => {
    if (!getIsLoggedIn()) {
      alert('Vui lòng đăng nhập để sử dụng giỏ hàng!');
      return;
    }
    setCart(newCart);
    localStorage.setItem(getCartKey(), JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const addToCart = useCallback((product, quantity = 1) => {
    if (!getIsLoggedIn()) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }
    const newCart = [...cart];
    const existing = newCart.find((i) => i.productId === product.id);
    const stock = product.stockQuantity !== undefined ? product.stockQuantity : 999; // Fallback nếu không có stock

    if (existing) {
      if (existing.quantity + quantity > stock) {
        alert(`Sản phẩm này chỉ còn ${stock} sản phẩm trong kho!`);
        existing.quantity = stock;
      } else {
        existing.quantity += quantity;
      }
      existing.stockQuantity = stock;
    } else {
      let finalQuantity = quantity;
      if (quantity > stock) {
        alert(`Sản phẩm này chỉ còn ${stock} sản phẩm trong kho!`);
        finalQuantity = stock;
      }
      if (finalQuantity > 0) {
        newCart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: finalQuantity,
          stockQuantity: stock,
        });
      }
    }
    saveCart(newCart);
  }, [cart]);

  const removeFromCart = useCallback((productId) => {
    saveCart(cart.filter((i) => i.productId !== productId));
  }, [cart]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    const newCart = cart.map((i) => {
      if (i.productId === productId) {
        if (i.stockQuantity !== undefined && quantity > i.stockQuantity) {
          alert(`Sản phẩm này chỉ còn ${i.stockQuantity} sản phẩm trong kho!`);
          return { ...i, quantity: i.stockQuantity };
        }
        return { ...i, quantity };
      }
      return i;
    });
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
