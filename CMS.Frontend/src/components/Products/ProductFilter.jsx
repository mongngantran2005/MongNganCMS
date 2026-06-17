import React from 'react';

/**
 * ProductFilter - Bộ lọc sản phẩm theo giá và tồn kho
 */
function ProductFilter({ minPrice, maxPrice, inStockOnly, onMinPrice, onMaxPrice, onInStockOnly, onReset }) {
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '8px', padding: '16px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginTop: '16px'
    }}>
      <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#333', marginBottom: '14px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
        Bộ Lọc
      </h4>

      {/* Khoảng giá */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '8px' }}>
          Khoảng giá (VND)
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            id="filter-min-price"
            type="number"
            value={minPrice}
            onChange={e => onMinPrice(e.target.value)}
            placeholder="Từ"
            style={{ width: '80px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
          />
          <span style={{ color: '#999' }}>—</span>
          <input
            id="filter-max-price"
            type="number"
            value={maxPrice}
            onChange={e => onMaxPrice(e.target.value)}
            placeholder="Đến"
            style={{ width: '80px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
          />
        </div>
      </div>

      {/* Còn hàng */}
      <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          id="filter-in-stock"
          type="checkbox"
          checked={inStockOnly}
          onChange={e => onInStockOnly(e.target.checked)}
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
        <label htmlFor="filter-in-stock" style={{ fontSize: '13px', color: '#555', cursor: 'pointer' }}>
          Chỉ hiện sản phẩm còn hàng
        </label>
      </div>

      <button
        id="filter-reset-btn"
        onClick={onReset}
        style={{
          width: '100%', padding: '8px', backgroundColor: '#f5f5f5',
          border: '1px solid #ddd', borderRadius: '6px',
          fontSize: '13px', cursor: 'pointer', color: '#555',
          fontFamily: 'inherit', transition: 'background 0.2s'
        }}
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}

export default ProductFilter;
