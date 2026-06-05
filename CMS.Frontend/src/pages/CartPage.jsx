import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function CartPage() {
  const [cart, setCart] = useState([]);
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleCheckout = () => {
    if (!customerInfo) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login');
      return;
    }

    if (cart.length === 0) return;

    const payload = {
      customerId: customerInfo.id,
      notes: notes,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };

    api.post('/orders', payload)
      .then(res => {
        alert(res.data.message);
        localStorage.removeItem('cart');
        setCart([]);
        navigate('/');
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
      });
  };

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="container section-padding">
      <h1 className="section-title">Giỏ Hàng Của Bạn</h1>
      
      {cart.length === 0 ? (
        <div className="glass-card text-center animate-fade-in" style={{ padding: '60px 20px' }}>
          <h2 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Giỏ hàng đang trống</h2>
          <Link to="/products" className="btn-primary">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '2', minWidth: '300px' }} className="animate-fade-in">
            {cart.map((item, index) => (
              <div key={index} className="glass-card" style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
                <img 
                  src={item.imageUrl ? `https://localhost:7296${item.imageUrl}` : 'https://via.placeholder.com/100'} 
                  alt={item.name} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                />
                <div style={{ flex: '1' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{item.name}</h3>
                  <p className="price" style={{ fontSize: '1.2rem', marginBottom: '0' }}>{item.price.toLocaleString()} đ</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', borderRadius: '6px' }}>
                  <button style={{ padding: '5px 12px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => updateQuantity(index, -1)}>-</button>
                  <span style={{ padding: '5px 15px', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>{item.quantity}</span>
                  <button style={{ padding: '5px 12px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => updateQuantity(index, 1)}>+</button>
                </div>
                <button onClick={() => removeItem(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer', padding: '10px' }}>&times;</button>
              </div>
            ))}
          </div>

          <div style={{ flex: '1', minWidth: '300px' }} className="animate-fade-in">
            <div className="glass-card" style={{ position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>Tổng quan đơn hàng</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--text-muted)' }}>
                <span>Tạm tính:</span>
                <span>{totalAmount.toLocaleString()} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--text-muted)' }}>
                <span>Phí giao hàng:</span>
                <span>Miễn phí</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>Tổng cộng:</span>
                <span className="price" style={{ fontSize: '1.5rem', margin: '0' }}>{totalAmount.toLocaleString()} đ</span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Ghi chú đơn hàng:</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', padding: '10px', borderRadius: '6px' }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }} onClick={handleCheckout}>
                Tiến Hành Đặt Hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
