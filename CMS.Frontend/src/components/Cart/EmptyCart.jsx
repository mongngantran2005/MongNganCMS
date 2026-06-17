import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

/**
 * EmptyCart - Màn hình giỏ hàng trống
 */
function EmptyCart() {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '70px 20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <ShoppingBag size={36} color="#ccc" />
      </div>
      <h2 style={{ fontSize: '18px', color: '#555', marginBottom: '10px', fontWeight: '600' }}>
        Giỏ hàng của bạn đang trống
      </h2>
      <p style={{ fontSize: '14px', color: '#999', marginBottom: '28px' }}>
        Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm nhé!
      </p>
      <Link
        id="empty-cart-shop-link"
        to="/products"
        style={{
          display: 'inline-block', backgroundColor: 'var(--primary, #326e51)',
          color: '#fff', padding: '13px 36px', borderRadius: '6px',
          textDecoration: 'none', fontWeight: '700', fontSize: '15px',
          transition: 'background 0.2s'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#26553e'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary, #326e51)'; }}
      >
        Tiếp Tục Mua Sắm
      </Link>
    </div>
  );
}

export default EmptyCart;
