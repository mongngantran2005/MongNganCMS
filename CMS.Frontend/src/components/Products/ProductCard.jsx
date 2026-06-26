import React from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL;

function getImg(url, fallback = 'https://via.placeholder.com/400') {
  if (!url) return fallback;
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

/**
 * ProductCard - Thẻ sản phẩm hiển thị trong lưới
 */
function ProductCard({ product }) {
  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const oldPrice = product.price * 1.1;

  return (
    <Link
      to={`/products/${product.id}`}
      id={`product-card-${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div
        style={{
          border: '1px solid #eee',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#fff',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.2s, transform 0.2s',
          cursor: 'pointer',
          position: 'relative',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'none';
        }}
      >
        {/* Discount badge */}
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          backgroundColor: '#ee4d2d', color: '#fff',
          fontSize: '11px', fontWeight: '700',
          padding: '2px 7px', borderRadius: '4px', zIndex: 1
        }}>
          -10%
        </span>

        {/* Image */}
        <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={getImg(product.imageUrl)}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
            onError={e => { e.target.src = 'https://via.placeholder.com/400'; }}
          />
        </div>

        {/* Info */}
        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.categoryName}
          </div>
          <h3 style={{
            fontSize: '14px', fontWeight: '500', color: '#333', margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            lineHeight: '1.4', flex: 1
          }}>
            {product.name}
          </h3>
          <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
            <div style={{ color: 'var(--primary, #326e51)', fontSize: '16px', fontWeight: '700' }}>
              {formatPrice(product.price)}
            </div>
            <div style={{ color: '#bbb', fontSize: '12px', textDecoration: 'line-through' }}>
              {formatPrice(oldPrice)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
