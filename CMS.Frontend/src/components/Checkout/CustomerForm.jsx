import React from 'react';

/**
 * CustomerForm - Thông tin khách hàng trong checkout
 */
function CustomerForm({ form, onChange }) {
  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s'
  };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' };

  const handleFocus = (e) => { e.target.style.borderColor = 'var(--primary, #326e51)'; };
  const handleBlur = (e) => { e.target.style.borderColor = '#ddd'; };

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--primary, #326e51)' }}>01</span> Thông Tin Người Nhận
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label style={labelStyle}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
          <input id="checkout-fullname" name="fullName" type="text" value={form.fullName} onChange={onChange} placeholder="Nguyễn Văn A" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
        </div>
        <div>
          <label style={labelStyle}>Số điện thoại <span style={{ color: 'red' }}>*</span></label>
          <input id="checkout-phone" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="0901234567" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Email</label>
          <input id="checkout-email" name="email" type="email" value={form.email} onChange={onChange} placeholder="email@example.com" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
        </div>
      </div>
    </div>
  );
}

export default CustomerForm;
