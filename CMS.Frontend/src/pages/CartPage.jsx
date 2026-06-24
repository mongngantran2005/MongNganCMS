import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CartList from '../components/Cart/CartList';
import CartSummary from '../components/Cart/CartSummary';
import EmptyCart from '../components/Cart/EmptyCart';
import { useCart } from '../hooks/useCart';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useCart();
  
  const customerInfo = (() => {
    try { return JSON.parse(localStorage.getItem('customerInfo')); } 
    catch { return null; }
  })();

  const handleUpdateQuantity = (index, delta) => {
    const item = cart[index];
    if (item.quantity + delta > 0) {
      updateQuantity(item.productId, item.quantity + delta);
    }
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
    // Checkout all
    sessionStorage.setItem('checkoutItems', JSON.stringify(cart));
    navigate('/checkout');
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p).replace('₫', 'đ');

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '80vh', padding: '10px 0', fontFamily: 'Arial, sans-serif' }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
          <Link to="/" style={{ color: '#306E51', textDecoration: 'none' }}>Trang chủ</Link> &gt; <span style={{ color: '#666' }}>Giỏ hàng</span>
        </div>

        <h1 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: '#333' }}>
          Giỏ hàng <span style={{ fontSize: '15px', color: '#666', fontWeight: '400' }}>({cart.length} sản phẩm)</span>
        </h1>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <CartList 
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />

              <CartSummary 
                totalPrice={totalPrice}
                onCheckout={handleCheckout}
                selectedCount={cart.length}
              />
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px', paddingBottom: '30px', borderBottom: '1px solid #eee' }}>
              <Link to="/products" style={{ color: '#306E51', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                &lt; Tiếp tục mua hàng
              </Link>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <div style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  Tạm tính: <span style={{ fontSize: '16px', fontWeight: '700', color: '#FF6600' }}>{formatPrice(totalPrice)}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '5px' }}>(Đã bao gồm VAT)</div>
                <button
                  onClick={handleCheckout}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#FF6600',
                    color: '#fff', border: 'none', borderRadius: '4px',
                    fontSize: '14px', fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Tiến hành đặt hàng
                </button>
              </div>
            </div>

            {/* Có thể bạn thích */}
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ fontSize: '15px', color: '#333', fontWeight: '700', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                Có thể bạn thích <span style={{ color: '#FF6600', fontSize: '16px' }}>↻</span>
              </h3>
              <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px' }}>
                {[
                  { price: '1.050K', old: '1.500K' },
                  { price: '383K', old: '500K' },
                  { price: '383K', old: '500K' },
                  { price: '403K', old: '550K' },
                  { price: '408K', old: '550K' },
                  { price: '275K', old: '350K' },
                ].map((item, i) => (
                   <div key={i} style={{ width: '150px', flexShrink: 0, border: '1px solid #eee', borderRadius: '4px', padding: '0', overflow: 'hidden' }}>
                      <div style={{ height: '150px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={`https://placehold.co/150x150?text=SP+${i+1}`} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                      </div>
                      <div style={{ padding: '10px', backgroundColor: '#1d5e38' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '11px', marginBottom: '5px' }}>
                           <span style={{ textDecoration: 'line-through' }}>{item.old}</span>
                           <span>24H</span>
                         </div>
                         <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px', backgroundColor: '#d0021b', display: 'inline-block', padding: '2px 8px', borderRadius: '10px' }}>
                           {item.price}
                         </div>
                      </div>
                   </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
