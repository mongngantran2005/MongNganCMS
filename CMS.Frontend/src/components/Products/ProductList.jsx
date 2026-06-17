import React from 'react';
import ProductCard from './ProductCard';
import Loading from '../Common/Loading';

/**
 * ProductList - Lưới hiển thị danh sách sản phẩm
 */
function ProductList({ products, loading, emptyText = 'Không có sản phẩm nào.' }) {
  if (loading) return <Loading text="Đang tải sản phẩm..." />;

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
        <p style={{ fontSize: '15px' }}>{emptyText}</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '16px',
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
