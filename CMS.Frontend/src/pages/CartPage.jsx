import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartList from '../components/Cart/CartList';
import CartSummary from '../components/Cart/CartSummary';
import EmptyCart from '../components/Cart/EmptyCart';
import { useCart } from '../hooks/useCart';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [notes, setNotes] = useState('');
  
  const customerInfo = (() => {
    try { return JSON.parse(localStorage.getItem('customerInfo')); } 
    catch { return null; }
  })();

  // Mặc định chọn tất cả khi mới vào
  useEffect(() => {
    setSelectedItems(cart.map((_, i) => i));
  }, [cart.length]);

  const toggleSelect = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter(i => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((_, i) => i));
    }
  };

  const deleteSelected = () => {
    if (window.confirm('Bạn có chắc muốn xoá các sản phẩm đã chọn?')) {
      const itemsToRemove = selectedItems.map(i => cart[i].productId);
      itemsToRemove.forEach(id => removeFromCart(id));
      setSelectedItems([]);
    }
  };

  const handleUpdateQuantity = (index, delta) => {
    const item = cart[index];
    updateQuantity(item.productId, item.quantity + delta);
  };

  const handleRemoveItem = (index) => {
    removeFromCart(cart[index].productId);
  };

  const handleCheckout = () => {
    if (!customerInfo) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login');
      return;
    }
    const itemsToCheckout = cart.filter((_, i) => selectedItems.includes(i));
    sessionStorage.setItem('checkoutItems', JSON.stringify(itemsToCheckout));
    sessionStorage.setItem('orderNotes', notes);
    navigate('/checkout');
  };

  const totalPrice = cart
    .filter((_, i) => selectedItems.includes(i))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh', padding: '30px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '24px', color: '#222' }}>
          GIỎ HÀNG <span style={{ fontSize: '15px', color: '#666', fontWeight: '500', textTransform: 'none' }}>({cart.length} sản phẩm)</span>
        </h1>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <CartList 
              cart={cart}
              selectedItems={selectedItems}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
              onDeleteSelected={deleteSelected}
            />

            <CartSummary 
              selectedCount={selectedItems.length}
              totalPrice={totalPrice}
              notes={notes}
              onNotesChange={setNotes}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
