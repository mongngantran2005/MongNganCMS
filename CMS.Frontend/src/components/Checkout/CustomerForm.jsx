import React from 'react';

const errorText = { fontSize: '12px', color: '#dc2626', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' };

function CustomerForm({ form, onChange, errors = {} }) {
  const getInputStyle = (hasError) => ({
    width: '100%', padding: '10px 14px',
    border: `1.5px solid ${hasError ? '#dc2626' : '#ddd'}`,
    borderRadius: '6px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s',
    backgroundColor: hasError ? '#fff5f5' : '#fff',
  });
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' };

  const handleFocus = (e) => {
    if (!errors[e.target.name]) {
      e.target.style.borderColor = '#306E51';
      e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px';
    }
  };
  const handleBlur = (e) => {
    if (!errors[e.target.name]) {
      e.target.style.borderColor = '#ddd';
      e.target.style.boxShadow = 'none';
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#306E51' }}>01</span> Thông Tin Người Nhận
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Họ và tên */}
        <div data-has-error={!!errors.fullName}>
          <label style={labelStyle}>Họ và tên <span style={{ color: '#FF235C' }}>*</span></label>
          <input
            id="checkout-fullname"
            name="fullName" type="text"
            value={form.fullName} onChange={onChange}
            placeholder="Nguyễn Văn A"
            style={getInputStyle(!!errors.fullName)}
            onFocus={handleFocus} onBlur={handleBlur}
          />
          {errors.fullName && (
            <p style={errorText}>
              <span>⚠</span> {errors.fullName}
            </p>
          )}
        </div>

        {/* Số điện thoại */}
        <div data-has-error={!!errors.phone}>
          <label style={labelStyle}>Số điện thoại <span style={{ color: '#FF235C' }}>*</span></label>
          <input
            id="checkout-phone"
            name="phone" type="tel"
            value={form.phone} onChange={onChange}
            placeholder="0901234567"
            style={getInputStyle(!!errors.phone)}
            onFocus={handleFocus} onBlur={handleBlur}
          />
          {errors.phone && (
            <p style={errorText}>
              <span>⚠</span> {errors.phone}
            </p>
          )}
        </div>

        {/* Email */}
        <div style={{ gridColumn: '1 / -1' }} data-has-error={!!errors.email}>
          <label style={labelStyle}>Email <span style={{ color: '#94a3b8', fontWeight: '400', fontSize: '12px' }}>(không bắt buộc)</span></label>
          <input
            id="checkout-email"
            name="email" type="email"
            value={form.email} onChange={onChange}
            placeholder="email@example.com"
            style={getInputStyle(!!errors.email)}
            onFocus={handleFocus} onBlur={handleBlur}
          />
          {errors.email && (
            <p style={errorText}>
              <span>⚠</span> {errors.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerForm;
