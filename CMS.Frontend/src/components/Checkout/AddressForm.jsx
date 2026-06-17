import React from 'react';

/**
 * AddressForm - Form địa chỉ giao hàng trong checkout
 */
function AddressForm({ form, onChange }) {
  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' };
  const onFocus = e => { e.target.style.borderColor = 'var(--primary, #326e51)'; };
  const onBlur = e => { e.target.style.borderColor = '#ddd'; };

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--primary, #326e51)' }}>02</span> Địa Chỉ Giao Hàng
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={labelStyle}>Tỉnh / Thành phố <span style={{ color: 'red' }}>*</span></label>
          <input id="checkout-city" name="city" type="text" value={form.city} onChange={onChange}
            placeholder="Hồ Chí Minh" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div>
          <label style={labelStyle}>Quận / Huyện <span style={{ color: 'red' }}>*</span></label>
          <input id="checkout-district" name="district" type="text" value={form.district} onChange={onChange}
            placeholder="Quận 1" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div>
          <label style={labelStyle}>Phường / Xã <span style={{ color: 'red' }}>*</span></label>
          <input id="checkout-ward" name="ward" type="text" value={form.ward} onChange={onChange}
            placeholder="Phường Bến Nghé" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div>
          <label style={labelStyle}>Số nhà, tên đường <span style={{ color: 'red' }}>*</span></label>
          <input id="checkout-address" name="address" type="text" value={form.address} onChange={onChange}
            placeholder="123 Nguyễn Huệ" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div>
          <label style={labelStyle}>Ghi chú</label>
          <textarea id="checkout-note" name="note" value={form.note} onChange={onChange}
            placeholder="Ghi chú cho người giao hàng..." rows={2}
            style={{ ...inputStyle, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur} />
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
