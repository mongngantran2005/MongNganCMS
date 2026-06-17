import React from 'react';
import CartItem from './CartItem';
import { Trash2 } from 'lucide-react';

/**
 * CartList - Danh sách sản phẩm trong giỏ hàng
 */
function CartList({ cart, selectedItems, onToggleSelect, onToggleSelectAll, onUpdateQuantity, onRemove, onDeleteSelected }) {
  const allSelected = selectedItems.length === cart.length && cart.length > 0;

  return (
    <div style={{ flex: '1 1 65%', minWidth: '320px' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#fff', padding: '14px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <input
          id="cart-select-all"
          type="checkbox"
          checked={allSelected}
          onChange={onToggleSelectAll}
          style={{ width: '18px', height: '18px', marginRight: '12px', cursor: 'pointer' }}
        />
        <span style={{ fontWeight: '600', fontSize: '15px' }}>Chọn tất cả ({cart.length} sản phẩm)</span>
        <button
          id="cart-delete-selected"
          onClick={onDeleteSelected}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#e30019'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#999'; }}
        >
          <Trash2 size={16} /> Xóa đã chọn
        </button>
      </div>

      {/* Items */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {cart.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            index={index}
            isSelected={selectedItems.includes(index)}
            onToggleSelect={onToggleSelect}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

export default CartList;
