import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5188';
function getImg(url) {
  if (!url) return 'https://via.placeholder.com/90';
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

function CartItem({ item, index, onUpdateQuantity, onRemove }) {
  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p).replace('₫', 'đ');

  return (
    <div style={{ display: 'flex', padding: '20px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'flex-start' }}>
      {/* Product Image & Info */}
      <div style={{ flex: '2', display: 'flex', gap: '15px', paddingRight: '20px' }}>
        <Link to={`/products/${item.productId}`} style={{ display: 'block', width: '80px', height: '80px', flexShrink: 0 }}>
          <img src={getImg(item.imageUrl)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Link>
        <div>
          <Link to={`/products/${item.productId}`} style={{ textDecoration: 'none', color: '#333' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px', color: '#333', textTransform: 'uppercase' }}>
              {item.brand || 'COCOON'}
            </h3>
            <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.4', marginBottom: '15px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.name}
            </div>
          </Link>
          <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#666' }}>
            <button style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
              <Heart size={14} /> Yêu thích
            </button>
            <button onClick={() => onRemove(index)} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
              <X size={14} /> Xóa
            </button>
          </div>
        </div>
      </div>

      {/* Price */}
      <div style={{ flex: '1', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80px' }}>
        <div style={{ color: '#333', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{formatPrice(item.price)}</div>
        <div style={{ color: '#999', fontSize: '12px', textDecoration: 'line-through' }}>{formatPrice(item.price * 1.1)}</div>
      </div>

      {/* Quantity */}
      <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '2px', overflow: 'hidden', height: '28px' }}>
          <input 
            type="number" 
            value={item.quantity} 
            onChange={(e) => {
               const val = parseInt(e.target.value);
               if (val > 0) {
                 onUpdateQuantity(index, val - item.quantity); // Pass delta
               }
            }}
            style={{ width: '35px', height: '100%', border: 'none', textAlign: 'center', fontSize: '13px', outline: 'none' }} 
            min="1"
          />
          <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ddd', height: '100%' }}>
            <button onClick={() => onUpdateQuantity(index, 1)} style={{ width: '20px', height: '50%', background: '#f5f5f5', border: 'none', borderBottom: '1px solid #ddd', cursor: 'pointer', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', padding: 0 }}>▲</button>
            <button onClick={() => onUpdateQuantity(index, -1)} style={{ width: '20px', height: '50%', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', padding: 0 }}>▼</button>
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div style={{ flex: '1', textAlign: 'right', color: '#333', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '80px' }}>
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
}

export default CartItem;
