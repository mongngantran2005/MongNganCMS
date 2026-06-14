import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Plus, ChevronRight, Truck, ShieldCheck, CreditCard, Wallet, Check, Package } from 'lucide-react';
import api from '../api';

function CheckoutPage() {
  const navigate = useNavigate();
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  useEffect(() => {
    if (!customerInfo) { navigate('/login'); return; }

    // Lấy các sản phẩm được chọn từ giỏ hàng (lưu trong sessionStorage khi từ CartPage)
    const checkoutItems = JSON.parse(sessionStorage.getItem('checkoutItems') || '[]');
    if (checkoutItems.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(checkoutItems);

    // Tải địa chỉ
    api.get(`/customers/${customerInfo.id}/addresses`)
      .then(res => {
        setAddresses(res.data);
        const def = res.data.find(a => a.isDefault);
        if (def) setSelectedAddressId(def.id);
        else if (res.data.length > 0) setSelectedAddressId(res.data[0].id);
      })
      .catch(() => {});
  }, []);

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  const getImg = (url) => { if (!url) return ''; return url.startsWith('http') ? url : `http://localhost:5188${url}`; };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = cartItems.reduce((s, i) => s + (i.price * 0.1) * i.quantity, 0);
  const shipping = 0;
  const total = subtotal;

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId && addresses.length > 0) {
      alert('Vui lòng chọn địa chỉ giao hàng!');
      return;
    }

    setPlacing(true);
    try {
      const payload = {
        customerId: customerInfo.id,
        notes,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };

      const res = await api.post('/orders', payload);

      // Xóa items đã checkout khỏi giỏ hàng
      const allCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const checkoutProductIds = cartItems.map(i => i.productId);
      const remaining = allCart.filter(i => !checkoutProductIds.includes(i.productId));
      localStorage.setItem('cart', JSON.stringify(remaining));
      sessionStorage.removeItem('checkoutItems');
      window.dispatchEvent(new Event('storage'));

      navigate('/order-success', { state: { orderId: res.data.orderId } });
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee', padding: '12px 0', marginBottom: '20px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
          <span>›</span>
          <Link to="/cart" style={{ color: '#888', textDecoration: 'none' }}>Giỏ hàng</Link>
          <span>›</span>
          <span style={{ color: '#333', fontWeight: '500' }}>Thanh toán</span>
        </div>
      </div>

      {/* Steps */}
      <div className="container" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', backgroundColor: '#fff', borderRadius: '8px', padding: '16px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {[
            { label: 'Giỏ hàng', step: 1, done: true },
            { label: 'Thanh toán', step: 2, active: true },
            { label: 'Hoàn thành', step: 3 },
          ].map((s, i) => (
            <React.Fragment key={s.step}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: s.done ? '#16a34a' : s.active ? '#ee4d2d' : '#ddd',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700'
                }}>
                  {s.done ? <Check size={14} /> : s.step}
                </div>
                <span style={{ fontSize: '14px', fontWeight: s.active ? '700' : '400', color: s.active ? '#ee4d2d' : s.done ? '#16a34a' : '#999' }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '1px', backgroundColor: '#eee', margin: '0 16px' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="container" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* ─── LEFT COLUMN ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Delivery Address */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#ee4d2d" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Địa chỉ nhận hàng</h3>
              </div>
              <button onClick={() => navigate('/profile', { state: { tab: 'addresses' } })}
                style={{ border: 'none', background: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={14} /> Thêm địa chỉ
              </button>
            </div>

            {addresses.length === 0 ? (
              <div style={{ padding: '20px', border: '2px dashed #eee', borderRadius: '8px', textAlign: 'center', color: '#aaa' }}>
                <MapPin size={32} color="#ddd" style={{ marginBottom: '8px' }} />
                <div style={{ marginBottom: '12px', fontSize: '14px' }}>Bạn chưa có địa chỉ nhận hàng nào</div>
                <Link to="/profile" style={{ color: '#1a73e8', fontSize: '13px', textDecoration: 'none' }}>
                  + Thêm địa chỉ mới trong hồ sơ
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {addresses.slice(0, showAddressPicker ? addresses.length : 2).map(addr => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    style={{
                      border: `2px solid ${selectedAddressId === addr.id ? '#ee4d2d' : '#eee'}`,
                      borderRadius: '8px', padding: '14px 16px', cursor: 'pointer',
                      backgroundColor: selectedAddressId === addr.id ? '#fff5f5' : '#fafafa',
                      transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedAddressId === addr.id ? '#ee4d2d' : '#ccc'}`,
                      backgroundColor: selectedAddressId === addr.id ? '#ee4d2d' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
                    }}>
                      {selectedAddressId === addr.id && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#fff' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>{addr.fullName}</span>
                        <span style={{ color: '#888', fontSize: '13px' }}>| {addr.phone}</span>
                        {addr.isDefault && <span style={{ backgroundColor: '#ee4d2d', color: '#fff', fontSize: '11px', padding: '1px 8px', borderRadius: '10px' }}>Mặc định</span>}
                      </div>
                      <div style={{ fontSize: '13px', color: '#555' }}>
                        {[addr.streetAddress, addr.ward, addr.district, addr.province].filter(Boolean).join(', ')}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '3px', backgroundColor: '#f0f0f0', display: 'inline-block', padding: '2px 8px', borderRadius: '10px' }}>{addr.addressType}</div>
                    </div>
                  </div>
                ))}
                {addresses.length > 2 && (
                  <button onClick={() => setShowAddressPicker(!showAddressPicker)}
                    style={{ border: '1px dashed #ccc', background: '#fafafa', padding: '10px', borderRadius: '8px', color: '#555', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    {showAddressPicker ? 'Thu gọn' : `Xem thêm ${addresses.length - 2} địa chỉ khác`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Package size={18} color="#ee4d2d" />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Sản phẩm ({cartItems.length})</h3>
            </div>
            {cartItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 0', borderBottom: i < cartItems.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ width: '70px', height: '70px', border: '1px solid #eee', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#fafafa' }}>
                  <img src={getImg(item.imageUrl)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#333', fontWeight: '500', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={12} color="#16a34a" />
                    <span style={{ fontSize: '11px', color: '#16a34a' }}>100% Chính Hãng</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#e30019' }}>{formatPrice(item.price)}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>x{item.quantity}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CreditCard size={18} color="#ee4d2d" />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Phương thức thanh toán</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { key: 'cod', icon: '💵', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi nhận hàng' },
                { key: 'transfer', icon: '🏦', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua ATM / Internet Banking' },
              ].map(method => (
                <div key={method.key} onClick={() => setPaymentMethod(method.key)}
                  style={{ border: `2px solid ${paymentMethod === method.key ? '#ee4d2d' : '#eee'}`, borderRadius: '8px', padding: '14px 16px', cursor: 'pointer', backgroundColor: paymentMethod === method.key ? '#fff5f5' : '#fafafa', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.15s' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === method.key ? '#ee4d2d' : '#ccc'}`, backgroundColor: paymentMethod === method.key ? '#ee4d2d' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {paymentMethod === method.key && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: '20px' }}>{method.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{method.label}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{method.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '14px', color: '#555', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Ghi chú đơn hàng (tuỳ chọn)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao..."
                style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Order Summary ─── */}
        <div style={{ width: '340px', flexShrink: 0, position: 'sticky', top: '90px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '14px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1a1a1a', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>Tóm tắt đơn hàng</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#555' }}>
              <span>Tạm tính ({cartItems.length} sản phẩm):</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#16a34a' }}>
              <span>Giảm giá:</span>
              <span>-{formatPrice(discount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: '#555' }}>
              <span>Phí vận chuyển:</span>
              <span style={{ color: '#16a34a', fontWeight: '600' }}>Miễn phí</span>
            </div>

            <div style={{ borderTop: '1px dashed #ddd', paddingTop: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#333' }}>Tổng tiền:</span>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#e30019' }}>{formatPrice(total)}</span>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#888', marginTop: '4px' }}>(Đã bao gồm VAT nếu có)</div>
            </div>

            {/* Selected Address Preview */}
            {selectedAddress && (
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '6px', padding: '12px', marginBottom: '16px', fontSize: '13px', color: '#555', borderLeft: '3px solid #ee4d2d' }}>
                <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>📍 Giao đến:</div>
                <div><strong>{selectedAddress.fullName}</strong> — {selectedAddress.phone}</div>
                <div style={{ marginTop: '3px', color: '#666' }}>{[selectedAddress.streetAddress, selectedAddress.ward, selectedAddress.district, selectedAddress.province].filter(Boolean).join(', ')}</div>
              </div>
            )}

            <button onClick={handlePlaceOrder} disabled={placing}
              style={{ width: '100%', backgroundColor: placing ? '#ccc' : '#e30019', color: '#fff', border: 'none', padding: '15px', borderRadius: '6px', fontSize: '16px', fontWeight: '700', cursor: placing ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.2s' }}
              onMouseEnter={e => { if (!placing) e.target.style.backgroundColor = '#c00015'; }}
              onMouseLeave={e => { if (!placing) e.target.style.backgroundColor = '#e30019'; }}
            >
              {placing ? 'Đang đặt hàng...' : '🛒 Đặt hàng ngay'}
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {[
              { icon: <ShieldCheck size={16} color="#16a34a" />, text: 'Hàng chính hãng 100%' },
              { icon: <Truck size={16} color="#1a73e8" />, text: 'Giao hàng nhanh miễn phí' },
              { icon: <Wallet size={16} color="#f59e0b" />, text: 'Hoàn tiền nếu không đúng hàng' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none', fontSize: '13px', color: '#555' }}>
                {t.icon} {t.text}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;
