import React, { useState, useEffect } from 'react';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../services/userService';
import { MapPin, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '', phone: '', province: '', district: '', ward: '', streetAddress: '', addressType: 'Nhà riêng', isDefault: false
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(console.error);
  }, []);

  const handleProvinceChange = (e) => {
    const pCode = e.target.options[e.target.selectedIndex].getAttribute('data-code');
    const pName = e.target.value;
    setFormData({ ...formData, province: pName, district: '', ward: '' });
    if (pCode) {
      fetch(`https://provinces.open-api.vn/api/p/${pCode}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts || []))
        .catch(console.error);
    } else {
      setDistricts([]);
    }
    setWards([]);
  };

  const handleDistrictChange = (e) => {
    const dCode = e.target.options[e.target.selectedIndex].getAttribute('data-code');
    const dName = e.target.value;
    setFormData({ ...formData, district: dName, ward: '' });
    if (dCode) {
      fetch(`https://provinces.open-api.vn/api/d/${dCode}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards || []))
        .catch(console.error);
    } else {
      setWards([]);
    }
  };

  const loadAddresses = () => {
    setLoading(true);
    getAddresses()
      .then(data => {
        setAddresses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAddNew = () => {
    setFormData({ fullName: '', phone: '', province: '', district: '', ward: '', streetAddress: '', addressType: 'Nhà riêng', isDefault: false });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (addr) => {
    setFormData({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      province: addr.province || '',
      district: addr.district || '',
      ward: addr.ward || '',
      streetAddress: addr.streetAddress || '',
      addressType: addr.addressType || 'Nhà riêng',
      isDefault: addr.isDefault || false
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await deleteAddress(id);
      loadAddresses();
    } catch (e) {
      alert('Xóa thất bại');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      loadAddresses();
    } catch (e) {
      alert('Cập nhật thất bại');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAddress(editingId, formData);
        alert('Cập nhật địa chỉ thành công!');
      } else {
        await addAddress(formData);
        alert('Thêm địa chỉ thành công!');
      }
      setShowForm(false);
      loadAddresses();
    } catch (e) {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  if (loading) return <div>Đang tải sổ địa chỉ...</div>;

  if (showForm) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '12px', border: '1px solid #EEEEEE', boxShadow: 'rgba(20, 25, 26, 0.04) 0px 2px 8px 0px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700', color: '#09090B' }}>{editingId ? 'Cập Nhật Địa Chỉ' : 'Thêm Địa Chỉ Mới'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Họ và tên</label>
              <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '10px 20px', borderRadius: '6px', border: '1px solid #CCCCCC', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Số điện thoại</label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px 20px', borderRadius: '6px', border: '1px solid #CCCCCC', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Tỉnh/Thành phố</label>
              <select required value={formData.province} onChange={handleProvinceChange} style={{ width: '100%', padding: '10px 20px', borderRadius: '6px', border: '1px solid #CCCCCC', backgroundColor: '#FFFFFF', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }}>
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces.map(p => <option key={p.code} value={p.name} data-code={p.code}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Quận/Huyện</label>
              <select required value={formData.district} onChange={handleDistrictChange} disabled={!formData.province} style={{ width: '100%', padding: '10px 20px', borderRadius: '6px', border: '1px solid #CCCCCC', backgroundColor: '#FFFFFF', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }}>
                <option value="">Chọn Quận/Huyện</option>
                {districts.map(d => <option key={d.code} value={d.name} data-code={d.code}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Phường/Xã</label>
              <select required value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} disabled={!formData.district} style={{ width: '100%', padding: '10px 20px', borderRadius: '6px', border: '1px solid #CCCCCC', backgroundColor: '#FFFFFF', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }}>
                <option value="">Chọn Phường/Xã</option>
                {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Địa chỉ cụ thể (Số nhà, ngõ, đường)</label>
            <input required type="text" value={formData.streetAddress} onChange={e => setFormData({...formData, streetAddress: e.target.value})} style={{ width: '100%', padding: '10px 20px', borderRadius: '6px', border: '1px solid #CCCCCC', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }} />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Loại địa chỉ</label>
              <select value={formData.addressType} onChange={e => setFormData({...formData, addressType: e.target.value})} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #CCCCCC', minWidth: '150px', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }}>
                <option value="Nhà riêng">Nhà riêng</option>
                <option value="Công ty">Công ty</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#333333' }}>
                <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} style={{ width: '16px', height: '16px', accentColor: '#306E51' }} />
                <span>Đặt làm địa chỉ mặc định</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#306E51', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', boxShadow: 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#276244'; e.target.style.boxShadow = 'rgba(20, 25, 26, 0.12) 0px 8px 24px 0px'; }} onMouseLeave={e => { e.target.style.backgroundColor = '#306E51'; e.target.style.boxShadow = 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px'; }}>Lưu Thay Đổi</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: '#333333', border: '1px solid #CCCCCC', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#F1F1F5'; }} onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}>Hủy Bỏ</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #CCCCCC' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#09090B', margin: 0 }}>Sổ Địa Chỉ</h2>
        <button onClick={handleAddNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#306E51', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', boxShadow: 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#276244'; e.target.style.boxShadow = 'rgba(20, 25, 26, 0.12) 0px 8px 24px 0px'; }} onMouseLeave={e => { e.target.style.backgroundColor = '#306E51'; e.target.style.boxShadow = 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px'; }}>
          <Plus size={16} /> Thêm Địa Chỉ Mới
        </button>
      </div>

      {addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#787878', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EEEEEE' }}>
          <MapPin size={48} color="#CCCCCC" style={{ marginBottom: '16px' }} />
          <p style={{ margin: 0 }}>Bạn chưa lưu địa chỉ nào.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {addresses.map(addr => (
            <div key={addr.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '24px', border: addr.isDefault ? '1px solid #306E51' : '1px solid #EEEEEE', borderRadius: '12px', backgroundColor: addr.isDefault ? '#CFEADD' : '#FFFFFF', boxShadow: 'rgba(20, 25, 26, 0.04) 0px 2px 8px 0px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '16px', color: '#09090B' }}>{addr.fullName}</span>
                  <span style={{ color: '#CCCCCC' }}>|</span>
                  <span style={{ color: '#787878', fontSize: '14px' }}>{addr.phone}</span>
                  {addr.isDefault && (
                    <span style={{ padding: '4px 8px', backgroundColor: '#306E51', color: '#FFFFFF', fontSize: '11px', borderRadius: '4px', fontWeight: '700' }}>
                      Mặc định
                    </span>
                  )}
                </div>
                <div style={{ color: '#333333', marginBottom: '4px', fontSize: '14px' }}>{addr.streetAddress}</div>
                <div style={{ color: '#333333', fontSize: '14px' }}>{addr.ward}, {addr.district}, {addr.province}</div>
                <div style={{ marginTop: '12px', display: 'inline-block', padding: '4px 12px', backgroundColor: '#F1F1F5', color: '#787878', fontSize: '12px', borderRadius: '100px', fontWeight: '500' }}>
                  {addr.addressType}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={() => handleEdit(addr)} style={{ background: 'none', border: 'none', color: '#306E51', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '500' }}>
                    <Edit2 size={16} /> Sửa
                  </button>
                  {!addr.isDefault && (
                    <button onClick={() => handleDelete(addr.id)} style={{ background: 'none', border: 'none', color: '#FF235C', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '500' }}>
                      <Trash2 size={16} /> Xóa
                    </button>
                  )}
                </div>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #CCCCCC', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#333333', fontWeight: '500', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#F1F1F5'; }} onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}>
                    Thiết lập mặc định
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressBook;
