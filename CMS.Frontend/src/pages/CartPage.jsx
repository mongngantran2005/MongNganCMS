import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShieldCheck, ChevronRight, Truck } from 'lucide-react';
import api from '../api';

function CartPage() {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    // Mặc định chọn tất cả
    setSelectedItems(savedCart.map((_, i) => i));
  }, []);

  const getImg = (url) => {
    if (!url) return 'https://via.placeholder.com/90';
    return url.startsWith('http') ? url : `http://localhost:5188${url}`;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    setSelectedItems(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

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

  const handleCheckout = () => {
    if (!customerInfo) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login');
      return;
    }
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!');
      return;
    }

    const itemsToCheckout = cart.filter((_, i) => selectedItems.includes(i));
    // Lưu vào sessionStorage để CheckoutPage lấy
    sessionStorage.setItem('checkoutItems', JSON.stringify(itemsToCheckout));
    navigate('/checkout');
  };

  const totalSelectedAmount = cart
    .filter((_, i) => selectedItems.includes(i))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const totalOldAmount = cart
    .filter((_, i) => selectedItems.includes(i))
    .reduce((total, item) => total + (item.price * 1.1) * item.quantity, 0);

  const discountAmount = totalOldAmount - totalSelectedAmount;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh', padding: '30px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '24px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '20px', color: '#333' }}>
          GIỎ HÀNG <span style={{ fontSize: '16px', color: '#666', fontWeight: 'normal', textTransform: 'none' }}>({cart.length} sản phẩm)</span>
        </h1>

        {cart.length === 0 ? (
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <img src="https://hasaki.vn/images/graphics/empty-cart.png" alt="Empty Cart" style={{ width: '150px', marginBottom: '20px', opacity: 0.5 }} />
            <h2 style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>Chưa có sản phẩm nào trong giỏ hàng</h2>
            <Link to="/products" style={{ display: 'inline-block', backgroundColor: 'var(--primary)', color: '#fff', padding: '12px 30px', borderRadius: '4px', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>
              TIẾP TỤC MUA SẮM
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            
            {/* Left Side: Cart Items */}
            <div style={{ flex: '1 1 65%', minWidth: '320px' }}>
              
              {/* Header List */}
              <div style={{ backgroundColor: '#fff', padding: '15px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', marginBottom: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <input 
                  type="checkbox" 
                  checked={selectedItems.length === cart.length && cart.length > 0} 
                  onChange={toggleSelectAll} 
                  style={{ width: '18px', height: '18px', marginRight: '15px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '600', fontSize: '15px' }}>Chọn tất cả ({cart.length} sản phẩm)</span>
                <button 
                  onClick={() => {
                    if(window.confirm('Bạn có chắc muốn xoá các sản phẩm đã chọn?')) {
                       const remainingCart = cart.filter((_, i) => !selectedItems.includes(i));
                       setCart(remainingCart);
                       setSelectedItems([]);
                       localStorage.setItem('cart', JSON.stringify(remainingCart));
                       window.dispatchEvent(new Event('storage'));
                    }
                  }}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Trash2 size={18} /> Xóa đã chọn
                </button>
              </div>

              {/* Item List */}
              <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {cart.map((item, index) => (
                  <div key={index} style={{ display: 'flex', padding: '20px', borderBottom: index < cart.length - 1 ? '1px solid #f0f0f0' : 'none', alignItems: 'flex-start' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(index)} 
                      onChange={() => toggleSelect(index)} 
                      style={{ width: '18px', height: '18px', marginRight: '15px', marginTop: '35px', cursor: 'pointer' }}
                    />
                    
                    <Link to={`/products/${item.productId}`} style={{ display: 'block', width: '90px', height: '90px', border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden', marginRight: '15px', flexShrink: 0 }}>
                      <img src={getImg(item.imageUrl)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }} />
                    </Link>

                    <div style={{ flex: 1 }}>
                      <Link to={`/products/${item.productId}`} style={{ textDecoration: 'none', color: '#333' }}>
                        <h3 style={{ fontSize: '14px', lineHeight: '1.4', marginBottom: '8px', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.name}
                        </h3>
                      </Link>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', marginBottom: '10px' }}>
                        <ShieldCheck size={12} /> 100% Chính Hãng
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                          <div style={{ color: '#e30019', fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{formatPrice(item.price)}</div>
                          <div style={{ color: '#999', fontSize: '12px', textDecoration: 'line-through' }}>{formatPrice(item.price * 1.1)}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          {/* Quantity */}
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                            <button onClick={() => updateQuantity(index, -1)} style={{ width: '32px', height: '32px', background: '#f9f9f9', border: 'none', borderRight: '1px solid #ddd', cursor: 'pointer', fontSize: '18px', color: '#666' }}>−</button>
                            <div style={{ width: '40px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>{item.quantity}</div>
                            <button onClick={() => updateQuantity(index, 1)} style={{ width: '32px', height: '32px', background: '#f9f9f9', border: 'none', borderLeft: '1px solid #ddd', cursor: 'pointer', fontSize: '16px', color: '#666' }}>+</button>
                          </div>

                          <button onClick={() => removeItem(index)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }} title="Xoá sản phẩm">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Summary Box */}
            <div style={{ flex: '1 1 30%', minWidth: '300px', position: 'sticky', top: '90px' }}>
              
              {/* Promo code area (Fake UI for Hasaki style) */}
              <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', marginBottom: '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '50%' }}>🎫</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Khuyến mãi / Mã giảm giá</span>
                 </div>
                 <ChevronRight size={18} color="#999" />
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Tóm tắt đơn hàng</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#555' }}>
                  <span>Tạm tính ({selectedItems.length} sản phẩm):</span>
                  <span>{formatPrice(totalSelectedAmount)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#16a34a' }}>
                    <span>Giảm giá khuyến mãi:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: '#555' }}>
                  <span>Phí vận chuyển:</span>
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>Miễn phí</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #ddd', paddingTop: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>Tổng tiền:</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', color: '#e30019', fontSize: '22px', fontWeight: '700' }}>{formatPrice(totalSelectedAmount)}</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>(Đã bao gồm VAT nếu có)</span>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <textarea
                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', padding: '10px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú đơn hàng (tuỳ chọn)..."
                  />
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  style={{ 
                    width: '100%', 
                    backgroundColor: selectedItems.length === 0 ? '#ccc' : '#e30019', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '14px', 
                    borderRadius: '4px', 
                    fontSize: '16px', 
                    fontWeight: '700', 
                    cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s'
                  }}
                >
                  Tiến Hành Thanh Toán →
                </button>
                
                <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <Truck size={14} color="#16a34a" /> <span>Miễn phí giao hàng cho đơn từ 99k</span>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
