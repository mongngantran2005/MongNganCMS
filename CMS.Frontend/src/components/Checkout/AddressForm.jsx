import React from 'react';
import { Link } from 'react-router-dom';

const errorText = { fontSize: '12px', color: '#dc2626', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' };

function AddressForm({ form, onChange, addresses = [], selectedAddressId, onAddressSelect, errors = {} }) {
  const getInputStyle = (hasError) => ({
    width: '100%', padding: '10px 14px',
    border: `1.5px solid ${hasError ? '#dc2626' : '#ddd'}`,
    borderRadius: '6px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s',
    backgroundColor: hasError ? '#fff5f5' : '#fff',
  });

  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' };

  const onFocus = e => {
    if (!errors[e.target.name]) {
      e.target.style.borderColor = '#306E51';
      e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px';
    }
  };
  const onBlur = e => {
    if (!errors[e.target.name]) {
      e.target.style.borderColor = '#ddd';
      e.target.style.boxShadow = 'none';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <span style={{ color: '#306E51' }}>02</span> Địa Chỉ Giao Hàng
        </h3>
        <Link to="/profile" style={{ fontSize: '13px', color: '#306E51', textDecoration: 'none', fontWeight: '600' }}>
          + Thêm địa chỉ mới
        </Link>
      </div>

      {addresses.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #eee' }}>
          <label style={labelStyle}>Chọn từ sổ địa chỉ của bạn</label>
          <select
            value={selectedAddressId || 'new'}
            onChange={(e) => onAddressSelect(e.target.value)}
            style={{ ...getInputStyle(false), cursor: 'pointer', backgroundColor: '#fff', borderColor: '#306E51' }}
          >
            {addresses.map(a => (
              <option key={a.id} value={a.id}>
                {a.fullName} - {a.phone} - {a.streetAddress}, {a.ward}, {a.district}, {a.province}
              </option>
            ))}
            <option value="new">+ Nhập địa chỉ giao hàng khác</option>
          </select>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Tỉnh / Thành phố */}
        <div data-has-error={!!errors.city}>
          <label style={labelStyle}>Tỉnh / Thành phố <span style={{ color: '#FF235C' }}>*</span></label>
          <input
            id="checkout-city" name="city" type="text"
            value={form.city} onChange={onChange}
            placeholder="Hồ Chí Minh"
            style={getInputStyle(!!errors.city)}
            onFocus={onFocus} onBlur={onBlur}
          />
          {errors.city && <p style={errorText}><span>⚠</span> {errors.city}</p>}
        </div>

        {/* Quận / Huyện */}
        <div data-has-error={!!errors.district}>
          <label style={labelStyle}>Quận / Huyện <span style={{ color: '#FF235C' }}>*</span></label>
          <input
            id="checkout-district" name="district" type="text"
            value={form.district} onChange={onChange}
            placeholder="Quận 1"
            style={getInputStyle(!!errors.district)}
            onFocus={onFocus} onBlur={onBlur}
          />
          {errors.district && <p style={errorText}><span>⚠</span> {errors.district}</p>}
        </div>

        {/* Phường / Xã */}
        <div data-has-error={!!errors.ward}>
          <label style={labelStyle}>Phường / Xã <span style={{ color: '#FF235C' }}>*</span></label>
          <input
            id="checkout-ward" name="ward" type="text"
            value={form.ward} onChange={onChange}
            placeholder="Phường Bến Nghé"
            style={getInputStyle(!!errors.ward)}
            onFocus={onFocus} onBlur={onBlur}
          />
          {errors.ward && <p style={errorText}><span>⚠</span> {errors.ward}</p>}
        </div>

        {/* Số nhà, tên đường */}
        <div data-has-error={!!errors.address}>
          <label style={labelStyle}>Số nhà, tên đường <span style={{ color: '#FF235C' }}>*</span></label>
          <input
            id="checkout-address" name="address" type="text"
            value={form.address} onChange={onChange}
            placeholder="123 Nguyễn Huệ"
            style={getInputStyle(!!errors.address)}
            onFocus={onFocus} onBlur={onBlur}
          />
          {errors.address && <p style={errorText}><span>⚠</span> {errors.address}</p>}
        </div>

        {/* Ghi chú */}
        <div>
          <label style={labelStyle}>Ghi chú <span style={{ color: '#94a3b8', fontWeight: '400', fontSize: '12px' }}>(không bắt buộc)</span></label>
          <textarea
            id="checkout-note" name="note"
            value={form.note} onChange={onChange}
            placeholder="Ghi chú cho người giao hàng..." rows={2}
            style={{ ...getInputStyle(false), resize: 'vertical' }}
            onFocus={onFocus} onBlur={onBlur}
          />
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
