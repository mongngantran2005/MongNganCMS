import React from 'react';

const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'name_asc', label: 'Tên: A → Z' },
  { value: 'newest', label: 'Mới nhất' },
];

/**
 * SortProduct - Dropdown sắp xếp sản phẩm
 */
function SortProduct({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '13px', color: '#666', whiteSpace: 'nowrap' }}>Sắp xếp:</span>
      <select
        id="sort-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '7px 12px', border: '1px solid #ddd', borderRadius: '6px',
          fontSize: '13px', outline: 'none', cursor: 'pointer',
          color: '#333', backgroundColor: '#fff', fontFamily: 'inherit'
        }}
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export { SORT_OPTIONS };
export default SortProduct;
