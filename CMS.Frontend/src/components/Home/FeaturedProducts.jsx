import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../Products/ProductCard';

/**
 * FeaturedProducts - Sản phẩm nổi bật trang chủ
 */
function FeaturedProducts({ products = [], loading = false }) {
  return (
    <section style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#222', margin: 0 }}>Sản Phẩm Nổi Bật</h2>
          <span style={{ backgroundColor: '#ee4d2d', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>HOT</span>
        </div>
        <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--primary, #326e51)', fontWeight: '600', textDecoration: 'none' }}>
          Xem tất cả <ChevronRight size={15} />
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ height: '280px', backgroundColor: '#f0f0f0', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>Chưa có sản phẩm nổi bật.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </section>
  );
}

export default FeaturedProducts;
