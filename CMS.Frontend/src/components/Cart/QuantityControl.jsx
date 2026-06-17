import React from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * QuantityControl - Điều chỉnh số lượng trong giỏ hàng
 */
function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
      <button
        id="qty-ctrl-decrease"
        onClick={onDecrease}
        style={{ width: '32px', height: '32px', background: '#f9f9f9', border: 'none', borderRight: '1px solid #ddd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', transition: 'background 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f0f0f0'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#f9f9f9'; }}
      >
        <Minus size={13} />
      </button>

      <span style={{ width: '40px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', userSelect: 'none' }}>
        {quantity}
      </span>

      <button
        id="qty-ctrl-increase"
        onClick={onIncrease}
        style={{ width: '32px', height: '32px', background: '#f9f9f9', border: 'none', borderLeft: '1px solid #ddd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', transition: 'background 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f0f0f0'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#f9f9f9'; }}
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

export default QuantityControl;
