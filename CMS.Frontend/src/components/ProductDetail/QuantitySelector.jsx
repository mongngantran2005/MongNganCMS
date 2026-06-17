import React from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * QuantitySelector - Bộ chọn số lượng sản phẩm
 */
function QuantitySelector({ quantity, onDecrease, onIncrease, max = Infinity, disabled = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>Số lượng:</span>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
        <button
          id="qty-decrease"
          onClick={onDecrease}
          disabled={disabled || quantity <= 1}
          style={{
            width: '36px', height: '36px', border: 'none',
            background: disabled || quantity <= 1 ? '#f9f9f9' : '#f5f5f5',
            cursor: disabled || quantity <= 1 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#555', transition: 'background 0.2s', borderRight: '1px solid #ddd'
          }}
        >
          <Minus size={14} />
        </button>

        <span id="qty-value" style={{ width: '52px', textAlign: 'center', fontSize: '15px', fontWeight: '700', lineHeight: '36px', userSelect: 'none' }}>
          {disabled ? 0 : quantity}
        </span>

        <button
          id="qty-increase"
          onClick={onIncrease}
          disabled={disabled || quantity >= max}
          style={{
            width: '36px', height: '36px', border: 'none',
            background: disabled || quantity >= max ? '#f9f9f9' : '#f5f5f5',
            cursor: disabled || quantity >= max ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#555', transition: 'background 0.2s', borderLeft: '1px solid #ddd'
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      {max !== Infinity && (
        <span style={{ fontSize: '12px', color: '#999' }}>Còn {max} sản phẩm</span>
      )}
    </div>
  );
}

export default QuantitySelector;
