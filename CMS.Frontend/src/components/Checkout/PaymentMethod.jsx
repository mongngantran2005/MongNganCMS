import React from 'react';

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  { value: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { value: 'momo', label: 'Ví MoMo', icon: '💜' },
  { value: 'zalopay', label: 'ZaloPay', icon: '🔵' },
];

/**
 * PaymentMethod - Lựa chọn phương thức thanh toán
 */
function PaymentMethod({ selected, onChange }) {
  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#306E51' }}>03</span> Phương Thức Thanh Toán
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {PAYMENT_METHODS.map(method => (
          <label
            key={method.value}
            id={`payment-${method.value}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '13px 16px', borderRadius: '8px', cursor: 'pointer',
              border: selected === method.value
                ? '2px solid #306E51'
                : '2px solid #eee',
              backgroundColor: selected === method.value ? '#CFEADD' : '#fff',
              transition: 'all 0.2s',
            }}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={selected === method.value}
              onChange={() => onChange(method.value)}
              style={{ width: '16px', height: '16px', accentColor: '#306E51', flexShrink: 0 }}
            />
            <span style={{ fontSize: '18px' }}>{method.icon}</span>
            <span style={{ fontSize: '14px', fontWeight: selected === method.value ? '700' : '400', color: '#333' }}>
              {method.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethod;
