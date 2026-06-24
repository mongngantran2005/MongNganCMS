import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';

const BACKEND_URL = 'http://localhost:5188';
function getImg(url) {
  if (!url) return 'https://placehold.co/200x200/f5f5f5/999?text=SP';
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}
const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

/**
 * RelatedProducts - Sản phẩm liên quan (cùng danh mục) - phong cách Hasaki
 */
function RelatedProducts({ currentProductId, categoryId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) return;
    getProducts()
      .then(data => {
        const related = data
          .filter(p => p.id !== currentProductId)
          .slice(0, 8);
        setProducts(related);
      })
      .catch(() => {});
  }, [categoryId, currentProductId]);

  if (products.length === 0) return null;

  return (
    <section style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px 28px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '4px', height: '22px', backgroundColor: '#326e51', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Sản Phẩm Liên Quan</h2>
        </div>
        <Link to="/products" style={{ fontSize: '13px', color: '#326e51', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Xem tất cả →
        </Link>
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'thin', scrollbarColor: '#ddd transparent' }}>
        {products.map(p => {
          const originalPrice = Math.round(p.price * 1.15 / 1000) * 1000;
          const discountPct = Math.round((1 - p.price / originalPrice) * 100);
          return (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              id={`related-product-${p.id}`}
              style={{ flexShrink: 0, width: '175px', textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', transition: 'all 0.25s', cursor: 'pointer' }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#c8e8d8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#eee';
                }}
              >
                {/* Image */}
                <div style={{ height: '175px', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={getImg(p.imageUrl)} alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', transition: 'transform 0.3s' }}
                    onError={e => { e.target.src = 'https://placehold.co/200x200'; }}
                    onMouseEnter={e => { e.target.style.transform = 'scale(1.07)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                  />
                  {discountPct > 0 && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#e30019', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '3px' }}>
                      -{discountPct}%
                    </div>
                  )}
                </div>
                {/* Info */}
                <div style={{ padding: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#333', margin: '0 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5', minHeight: '36px' }}>
                    {p.name}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#e30019' }}>
                      {formatPrice(p.price)}
                    </span>
                    <span style={{ fontSize: '11px', color: '#bbb', textDecoration: 'line-through' }}>
                      {formatPrice(originalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default RelatedProducts;
