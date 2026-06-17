import React from 'react';

const BACKEND_URL = 'http://localhost:5188';
function getImg(url) {
  if (!url) return 'https://via.placeholder.com/80';
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

/**
 * OrderSummary - Tóm tắt đơn hàng trong trang checkout
 */
function OrderSummary({ items }) {
  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
        Đơn Hàng Của Bạn ({items.length} sản phẩm)
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', flexShrink: 0, border: '1px solid #eee', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fafafa' }}>
              <img src={getImg(item.imageUrl)} alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                onError={e => { e.target.src = 'https://via.placeholder.com/56'; }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', color: '#333', margin: '0 0 4px', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                {item.name}
              </p>
              <span style={{ fontSize: '12px', color: '#999' }}>x{item.quantity}</span>
            </div>
            <div style={{ flexShrink: 0, fontSize: '14px', fontWeight: '700', color: '#ee4d2d' }}>
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px dashed #e5e5e5', paddingTop: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
          <span>Tạm tính:</span><span>{formatPrice(total)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#16a34a' }}>
          <span>Phí vận chuyển:</span><span>Miễn phí</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>Tổng cộng:</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#ee4d2d' }}>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
