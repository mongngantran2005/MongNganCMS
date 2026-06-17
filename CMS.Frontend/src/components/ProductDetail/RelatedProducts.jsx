import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';

const BACKEND_URL = 'http://localhost:5188';
function getImg(url) {
  if (!url) return 'https://via.placeholder.com/200';
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

/**
 * RelatedProducts - Sản phẩm liên quan (cùng danh mục)
 */
function RelatedProducts({ currentProductId, categoryId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) return;
    getProducts()
      .then(data => {
        const related = data
          .filter(p => p.categoryId === categoryId && p.id !== currentProductId)
          .slice(0, 5);
        setProducts(related);
      })
      .catch(() => {});
  }, [categoryId, currentProductId]);

  if (products.length === 0) return null;

  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <section style={{ marginTop: '40px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid var(--primary, #326e51)' }}>
        Sản Phẩm Liên Quan
      </h2>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
        {products.map(p => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            id={`related-product-${p.id}`}
            style={{ flexShrink: 0, width: '160px', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ height: '160px', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={getImg(p.imageUrl)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/200'; }} />
              </div>
              <div style={{ padding: '10px' }}>
                <p style={{ fontSize: '12px', color: '#333', margin: '0 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                  {p.name}
                </p>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary, #326e51)' }}>
                  {formatPrice(p.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
