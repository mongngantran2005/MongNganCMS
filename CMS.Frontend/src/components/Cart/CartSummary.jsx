import React from 'react';
import { ChevronRight, Truck } from 'lucide-react';

/**
 * CartSummary - Tóm tắt đơn hàng bên phải giỏ hàng
 */
function CartSummary({ selectedCount, totalPrice, notes, onNotesChange, onCheckout }) {
  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const oldTotal = totalPrice * 1.1;
  const discount = oldTotal - totalPrice;

  return (
    <div style={{ flex: '1 1 30%', minWidth: '280px', position: 'sticky', top: '90px' }}>
      {/* Promo code row */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '8px', padding: '14px 16px',
        marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🎫</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Khuyến mãi / Mã giảm giá</span>
        </div>
        <ChevronRight size={17} color="#999" />
      </div>

      {/* Summary box */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
          Tóm tắt đơn hàng
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#555' }}>
          <span>Tạm tính ({selectedCount} sản phẩm):</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#16a34a' }}>
            <span>Giảm giá:</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', fontSize: '14px', color: '#555' }}>
          <span>Phí vận chuyển:</span>
          <span style={{ color: '#16a34a', fontWeight: '700' }}>Miễn phí</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #ddd', paddingTop: '14px', marginBottom: '20px', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '15px', fontWeight: '600' }}>Tổng tiền:</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#e30019', fontSize: '22px', fontWeight: '800' }}>{formatPrice(totalPrice)}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>(Đã bao gồm VAT nếu có)</div>
          </div>
        </div>

        {/* Notes */}
        <textarea
          id="cart-notes"
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          rows={2}
          placeholder="Ghi chú đơn hàng (tuỳ chọn)..."
          style={{ width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '10px', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: '16px', boxSizing: 'border-box' }}
        />

        {/* Checkout button */}
        <button
          id="cart-checkout-btn"
          onClick={onCheckout}
          disabled={selectedCount === 0}
          style={{
            width: '100%', padding: '14px',
            backgroundColor: selectedCount === 0 ? '#ccc' : '#e30019',
            color: '#fff', border: 'none', borderRadius: '6px',
            fontSize: '16px', fontWeight: '700',
            cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase', transition: 'background 0.2s',
          }}
          onMouseEnter={e => { if (selectedCount > 0) e.currentTarget.style.background = '#b8001a'; }}
          onMouseLeave={e => { if (selectedCount > 0) e.currentTarget.style.background = '#e30019'; }}
        >
          Tiến Hành Thanh Toán →
        </button>

        <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <Truck size={13} color="#16a34a" />
          <span>Miễn phí giao hàng cho đơn từ 99.000₫</span>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;
