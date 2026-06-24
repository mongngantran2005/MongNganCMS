import React from 'react';

function CartSummary({ totalPrice, onCheckout, selectedCount }) {
  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p).replace('₫', 'đ');

  const oldTotal = totalPrice * 1.1; // Demo
  const discount = oldTotal - totalPrice; // Demo

  return (
    <div style={{ flex: '1 1 30%', minWidth: '250px', backgroundColor: '#fff', borderTop: '2px solid #306E51' }}>
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#333', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          Hóa đơn của bạn
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '13px', color: '#555' }}>
          <span>Tạm tính:</span>
          <span style={{ fontWeight: '700', color: '#333' }}>{formatPrice(totalPrice)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '13px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
          <span>Giảm giá:</span>
          <span style={{ fontWeight: '700', color: '#333' }}>0 đ</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '13px', color: '#555' }}>Tổng cộng:</span>
          <span style={{ color: '#FF6600', fontSize: '16px', fontWeight: '700' }}>{formatPrice(totalPrice)}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#999', marginBottom: '20px' }}>
          (Đã bao gồm VAT)
        </div>

        <button
          onClick={onCheckout}
          disabled={selectedCount === 0}
          style={{
            width: '100%', padding: '10px',
            backgroundColor: selectedCount === 0 ? '#ccc' : '#FF6600',
            color: '#fff', border: 'none', borderRadius: '4px',
            fontSize: '14px', fontWeight: '500',
            cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Tiến hành đặt hàng
        </button>
      </div>
    </div>
  );
}

export default CartSummary;
