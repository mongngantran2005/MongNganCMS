import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShieldCheck } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5188';
function getImg(url) {
  if (!url) return 'https://via.placeholder.com/90';
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

/**
 * CartItem - Một dòng sản phẩm trong giỏ hàng
 */
function CartItem({ item, index, isSelected, onToggleSelect, onUpdateQuantity, onRemove }) {
  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <div style={{ display: 'flex', padding: '20px', borderBottom: '1px solid #f0f0f0', alignItems: 'flex-start', gap: '14px' }}>
      {/* Checkbox */}
      <input
        type="checkbox"
        id={`cart-item-check-${index}`}
        checked={isSelected}
        onChange={() => onToggleSelect(index)}
        style={{ width: '18px', height: '18px', marginTop: '36px', cursor: 'pointer', flexShrink: 0 }}
      />

      {/* Image */}
      <Link to={`/products/${item.productId}`} style={{ display: 'block', width: '90px', height: '90px', flexShrink: 0, border: '1px solid #eee', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fafafa' }}>
        <img src={getImg(item.imageUrl)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
      </Link>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link to={`/products/${item.productId}`} style={{ textDecoration: 'none', color: '#333' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.4', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.name}
          </h3>
        </Link>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', marginBottom: '10px' }}>
          <ShieldCheck size={11} /> 100% Chính Hãng
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ color: '#e30019', fontSize: '16px', fontWeight: '700' }}>{formatPrice(item.price)}</div>
            <div style={{ color: '#bbb', fontSize: '12px', textDecoration: 'line-through' }}>{formatPrice(item.price * 1.1)}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Quantity control */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
              <button id={`cart-qty-minus-${index}`} onClick={() => onUpdateQuantity(index, -1)} style={{ width: '32px', height: '32px', background: '#f9f9f9', border: 'none', borderRight: '1px solid #ddd', cursor: 'pointer', fontSize: '18px', color: '#555' }}>−</button>
              <div style={{ width: '40px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' }}>{item.quantity}</div>
              <button id={`cart-qty-plus-${index}`} onClick={() => onUpdateQuantity(index, 1)} style={{ width: '32px', height: '32px', background: '#f9f9f9', border: 'none', borderLeft: '1px solid #ddd', cursor: 'pointer', fontSize: '16px', color: '#555' }}>+</button>
            </div>

            {/* Remove */}
            <button id={`cart-remove-${index}`} onClick={() => onRemove(index)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e30019'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#ccc'; }}
              title="Xóa sản phẩm"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
