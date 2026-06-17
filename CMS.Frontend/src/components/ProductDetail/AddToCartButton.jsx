import React from 'react';
import { ShoppingCart } from 'lucide-react';

/**
 * AddToCartButton - Nút thêm vào giỏ hàng / mua ngay
 */
function AddToCartButton({ onAddToCart, onBuyNow, outOfStock = false }) {
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <button
        id="btn-add-to-cart"
        onClick={onAddToCart}
        disabled={outOfStock}
        style={{
          flex: 1, minWidth: '140px', height: '48px',
          border: '2px solid #ee4d2d', backgroundColor: '#fff', color: '#ee4d2d',
          borderRadius: '8px', fontSize: '15px', fontWeight: '700',
          cursor: outOfStock ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          opacity: outOfStock ? 0.5 : 1, transition: 'all 0.2s',
        }}
        onMouseEnter={e => { if (!outOfStock) e.currentTarget.style.backgroundColor = '#fff5f5'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; }}
      >
        <ShoppingCart size={18} /> Giỏ Hàng
      </button>

      <button
        id="btn-buy-now"
        onClick={onBuyNow}
        disabled={outOfStock}
        style={{
          flex: 1, minWidth: '140px', height: '48px',
          border: 'none',
          backgroundColor: outOfStock ? '#ccc' : '#ee4d2d',
          color: '#fff', borderRadius: '8px', fontSize: '15px', fontWeight: '700',
          cursor: outOfStock ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { if (!outOfStock) e.currentTarget.style.backgroundColor = '#d44426'; }}
        onMouseLeave={e => { if (!outOfStock) e.currentTarget.style.backgroundColor = '#ee4d2d'; }}
      >
        {outOfStock ? 'HẾT HÀNG' : 'MUA NGAY'}
      </button>
    </div>
  );
}

export default AddToCartButton;
