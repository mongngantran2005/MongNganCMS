import React from 'react';
import CartItem from './CartItem';

function CartList({ cart, onUpdateQuantity, onRemove }) {
  return (
    <div style={{ flex: '1 1 65%', minWidth: '320px', backgroundColor: '#fff', padding: '0 20px', paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', paddingTop: '10px', marginBottom: '0', fontSize: '13px', color: '#555', fontWeight: '500' }}>
        <div style={{ flex: '2', paddingLeft: '0' }}>Sản phẩm</div>
        <div style={{ flex: '1', textAlign: 'center' }}>Giá tiền</div>
        <div style={{ flex: '1', textAlign: 'center' }}>Số lượng</div>
        <div style={{ flex: '1', textAlign: 'right', paddingRight: '0' }}>Thành tiền</div>
      </div>

      {/* Items */}
      <div>
        {cart.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            index={index}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

export default CartList;
