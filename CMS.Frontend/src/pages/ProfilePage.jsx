import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, LogOut, Camera, MapPin, Plus, X, ChevronDown, Trash2, Check } from 'lucide-react';
import api from '../api';

// ─── Address Modal ─────────────────────────────────────────────────────────────
function AddressModal({ customerId, editData, onClose, onSaved }) {
  const [form, setForm] = useState({
    fullName: editData?.fullName || '',
    phone: editData?.phone || '',
    province: editData?.province || '',
    district: editData?.district || '',
    ward: editData?.ward || '',
    streetAddress: editData?.streetAddress || '',
    addressType: editData?.addressType || 'Nhà riêng',
    isDefault: editData?.isDefault || false,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [provinceCode, setProvinceCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then(r => r.json())
      .then(data => setProvinces(data))
      .catch(() => {});
  }, []);

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    const name = provinces.find(p => p.code == code)?.name || '';
    setProvinceCode(code);
    setDistrictCode('');
    setForm(f => ({ ...f, province: name, district: '', ward: '' }));
    setDistricts([]);
    setWards([]);
    if (code) {
      fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
        .then(r => r.json())
        .then(data => setDistricts(data.districts || []));
    }
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const name = districts.find(d => d.code == code)?.name || '';
    setDistrictCode(code);
    setForm(f => ({ ...f, district: name, ward: '' }));
    setWards([]);
    if (code) {
      fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
        .then(r => r.json())
        .then(data => setWards(data.wards || []));
    }
  };

  const handleWardChange = (e) => {
    const name = wards.find(w => w.code == e.target.value)?.name || '';
    setForm(f => ({ ...f, ward: name }));
  };

  const handleSave = async () => {
    if (!form.fullName || !form.phone) { alert('Vui lòng nhập họ tên và số điện thoại.'); return; }
    if (!form.province || !form.district) { alert('Vui lòng chọn Tỉnh/TP và Quận/Huyện.'); return; }
    setSaving(true);
    try {
      if (editData?.id) {
        await api.put(`/customers/${customerId}/addresses/${editData.id}`, form);
      } else {
        await api.post(`/customers/${customerId}/addresses`, form);
      }
      onSaved();
    } catch { alert('Lỗi khi lưu địa chỉ.'); }
    finally { setSaving(false); }
  };

  const selectStyle = {
    width: '100%', padding: '14px 16px', border: '1px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', color: '#333',
    backgroundColor: '#f5f5f5', appearance: 'none', cursor: 'pointer',
    outline: 'none'
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', border: '1px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', color: '#333',
    backgroundColor: '#f5f5f5', outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '560px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 24px 18px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
            {editData?.id ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} color="#666" />
          </button>
        </div>

        <div style={{ padding: '22px 24px' }}>
          {/* Row 1: Phone + Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <input style={inputStyle} placeholder="Số điện thoại" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <input style={inputStyle} placeholder="Họ và tên" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
          </div>

          {/* Province */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <select style={selectStyle} value={provinceCode} onChange={handleProvinceChange}>
              <option value="">Chọn Tỉnh/ TP</option>
              {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }} />
          </div>

          {/* District */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <select style={{ ...selectStyle, color: districts.length === 0 ? '#aaa' : '#333' }} value={districtCode} onChange={handleDistrictChange} disabled={districts.length === 0}>
              <option value="">Chọn Quận/ Huyện</option>
              {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }} />
          </div>

          {/* Ward */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <select style={{ ...selectStyle, color: wards.length === 0 ? '#aaa' : '#333' }} value={wards.find(w => w.name === form.ward)?.code || ''} onChange={handleWardChange} disabled={wards.length === 0}>
              <option value="">Chọn Phường/ Xã</option>
              {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }} />
          </div>

          {/* Street Address */}
          <input
            style={{ ...inputStyle, marginBottom: '6px' }}
            placeholder="Số nhà + Tên đường"
            value={form.streetAddress}
            disabled={!form.province || !form.district || !form.ward}
            onChange={e => setForm(f => ({ ...f, streetAddress: e.target.value }))}
          />
          {(!form.province || !form.district || !form.ward) && (
            <p style={{ color: '#ee4d2d', fontSize: '12px', margin: '0 0 14px' }}>
              Vui lòng chọn Tỉnh/TP, Quận/ Huyện và Phường/ xã trước khi nhập Số nhà + Tên Đường
            </p>
          )}

          {/* Address Type */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', marginBottom: '18px' }}>
            <span style={{ fontSize: '14px', color: '#555', minWidth: '120px' }}>Chọn loại địa chỉ</span>
            <button
              onClick={() => setForm(f => ({ ...f, addressType: 'Nhà riêng' }))}
              style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid', borderColor: form.addressType === 'Nhà riêng' ? 'transparent' : '#ccc', backgroundColor: form.addressType === 'Nhà riêng' ? '#2d6a4f' : '#fff', color: form.addressType === 'Nhà riêng' ? '#fff' : '#555', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
            >Nhà riêng</button>
            <button
              onClick={() => setForm(f => ({ ...f, addressType: 'Công ty' }))}
              style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid', borderColor: form.addressType === 'Công ty' ? 'transparent' : '#ccc', backgroundColor: form.addressType === 'Công ty' ? '#2d6a4f' : '#fff', color: form.addressType === 'Công ty' ? '#fff' : '#555', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
            >Công ty</button>
          </div>

          {/* Default Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f0f0f0', marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', color: '#333' }}>Đặt làm địa chỉ mặc định</span>
            <div
              onClick={() => setForm(f => ({ ...f, isDefault: !f.isDefault }))}
              style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: form.isDefault ? '#2d6a4f' : '#ccc', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
            >
              <div style={{ position: 'absolute', top: '2px', left: form.isDefault ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', backgroundColor: '#d4edda', color: '#2d6a4f', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Hủy
            </button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', backgroundColor: '#2d6a4f', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Đang lưu...' : 'Tiếp tục'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Profile Page ──────────────────────────────────────────────────────────
function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ username: '', fullName: '', email: '', phone: '', gender: 'Nam', dateOfBirth: '', avatarUrl: '', address: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const navigate = useNavigate();

  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));

  useEffect(() => {
    if (!customerInfo) { navigate('/login'); return; }
    fetchProfile();
    fetchOrders();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/customers/${customerInfo.id}`);
      const d = res.data;
      setProfile({ username: d.username || '', fullName: d.fullName || '', email: d.email || '', phone: d.phone || '', gender: d.gender || 'Nam', dateOfBirth: d.dateOfBirth ? d.dateOfBirth.split('T')[0] : '', avatarUrl: d.avatarUrl || '', address: d.address || '' });
    } catch {}
  };

  const fetchOrders = async () => {
    try { const res = await api.get(`/orders/customer/${customerInfo.id}`); setOrders(res.data); } catch {}
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get(`/customers/${customerInfo.id}/addresses`);
      setAddresses(res.data);
    } catch (err) {
      // Bảng chưa tạo hoặc lỗi server - không crash, chỉ để danh sách trống
      console.warn('Không thể tải địa chỉ:', err?.response?.data?.message || err.message);
      setAddresses([]);
    }
  };

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { alert('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 1 MB.'); return; }
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) { alert('Định dạng không hợp lệ! Chỉ chấp nhận .JPEG, .PNG.'); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('fullName', profile.fullName);
      formData.append('username', profile.username || '');
      formData.append('phone', profile.phone || '');
      formData.append('address', profile.address || '');
      formData.append('gender', profile.gender || 'Nam');
      if (profile.dateOfBirth) formData.append('dateOfBirth', profile.dateOfBirth);
      if (avatarFile) formData.append('avatarFile', avatarFile);

      const res = await api.put(`/customers/${customerInfo.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.avatarUrl) { setProfile(prev => ({ ...prev, avatarUrl: res.data.avatarUrl })); setAvatarFile(null); setAvatarPreview(null); }

      alert('Cập nhật hồ sơ thành công!');
      const newAvatarUrl = res.data.avatarUrl || customerInfo.avatarUrl || '';
      localStorage.setItem('customerInfo', JSON.stringify({ ...customerInfo, fullName: profile.fullName, avatarUrl: newAvatarUrl }));
      window.dispatchEvent(new Event('storage'));
    } catch { alert('Lỗi cập nhật hồ sơ. Vui lòng thử lại.'); }
    finally { setSaving(false); }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try { await api.delete(`/customers/${customerInfo.id}/addresses/${id}`); fetchAddresses(); } catch { alert('Lỗi khi xóa địa chỉ.'); }
  };

  const handleSetDefault = async (id) => {
    try { await api.put(`/customers/${customerInfo.id}/addresses/${id}/set-default`); fetchAddresses(); } catch { alert('Lỗi khi đặt mặc định.'); }
  };

  const handleLogout = () => { localStorage.removeItem('customerInfo'); window.dispatchEvent(new Event('storage')); navigate('/login'); };
  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  const getStatusBadge = (s) => {
    const map = { 0: { label: 'Chờ duyệt', color: '#f39c12' }, 1: { label: 'Đang giao', color: '#3498db' }, 2: { label: 'Hoàn thành', color: '#2ecc71' } };
    const st = map[s] || { label: 'Khác', color: '#999' };
    return <span style={{ color: st.color, fontWeight: '600', fontSize: '13px' }}>{st.label}</span>;
  };

  const avatarSrc = avatarPreview || (profile.avatarUrl ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://localhost:5188${profile.avatarUrl}`) : null);

  const sidebarItems = [
    { key: 'profile', label: 'Thông tin tài khoản' },
    { key: 'orders', label: 'Đơn hàng của tôi' },
    { key: 'addresses', label: 'Sổ địa chỉ nhận hàng' },
  ];

  return (
    <div style={{ backgroundColor: '#f2f2f2', minHeight: '80vh', paddingBottom: '40px' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee', padding: '10px 0', marginBottom: '16px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
          <span>›</span>
          <span style={{ color: '#333' }}>
            {activeTab === 'profile' ? 'Thông tin tài khoản' : activeTab === 'orders' ? 'Đơn hàng của tôi' : 'Sổ địa chỉ nhận hàng'}
          </span>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* ─── Sidebar ─── */}
        <div style={{ width: '220px', flexShrink: 0 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {/* User Info */}
            <div style={{ padding: '18px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {avatarSrc ? <img src={avatarSrc} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={22} color="#999" />}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>Chào {profile.fullName || profile.username}</div>
                <button onClick={() => setActiveTab('profile')} style={{ border: 'none', background: 'none', color: '#888', fontSize: '12px', cursor: 'pointer', padding: 0 }}>Chỉnh sửa tài khoản</button>
              </div>
            </div>

            {/* Menu */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {sidebarItems.map(item => (
                <li key={item.key}>
                  <button
                    onClick={() => setActiveTab(item.key)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '12px 18px', border: 'none', background: 'none',
                      fontSize: '14px', cursor: 'pointer',
                      color: activeTab === item.key ? '#ee4d2d' : '#333',
                      fontWeight: activeTab === item.key ? '600' : '400',
                      borderLeft: activeTab === item.key ? '3px solid #ee4d2d' : '3px solid transparent',
                      transition: 'all 0.15s'
                    }}
                  >{item.label}</button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 18px', border: 'none', background: 'none', fontSize: '14px', cursor: 'pointer', color: '#555', borderLeft: '3px solid transparent' }}
                >Đăng xuất</button>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ══ TAB: Profile ══ */}
          {activeTab === 'profile' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px' }}>
              <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '14px', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>Hồ Sơ Của Tôi</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>
              <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: 1 }}>
                  <table style={{ width: '100%', borderSpacing: '0 14px' }}>
                    <tbody>
                      {[
                        { label: 'Tên đăng nhập', name: 'username', type: 'text' },
                        { label: 'Họ và tên', name: 'fullName', type: 'text' },
                        { label: 'Số điện thoại', name: 'phone', type: 'text' },
                        { label: 'Địa chỉ', name: 'address', type: 'text' },
                      ].map(field => (
                        <tr key={field.name}>
                          <td style={{ width: '28%', textAlign: 'right', paddingRight: '18px', color: '#666', fontSize: '14px', whiteSpace: 'nowrap' }}>{field.label}</td>
                          <td>
                            <input type={field.type} name={field.name} value={profile[field.name]} onChange={handleChange}
                              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td style={{ textAlign: 'right', paddingRight: '18px', color: '#666', fontSize: '14px' }}>Email</td>
                        <td style={{ fontSize: '14px', color: '#333' }}>{profile.email}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'right', paddingRight: '18px', color: '#666', fontSize: '14px' }}>Giới tính</td>
                        <td style={{ display: 'flex', gap: '16px', fontSize: '14px', paddingTop: '4px' }}>
                          {['Nam', 'Nữ', 'Khác'].map(g => (
                            <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                              <input type="radio" name="gender" value={g} checked={profile.gender === g} onChange={handleChange} /> {g}
                            </label>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'right', paddingRight: '18px', color: '#666', fontSize: '14px' }}>Ngày sinh</td>
                        <td><input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} style={{ padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }} /></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style={{ paddingTop: '8px' }}>
                          <button onClick={handleSaveProfile} disabled={saving}
                            style={{ backgroundColor: saving ? '#ccc' : '#ee4d2d', color: '#fff', border: 'none', padding: '10px 28px', borderRadius: '4px', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                            {saving ? 'Đang lưu...' : 'Lưu'}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Avatar */}
                <div style={{ width: '180px', borderLeft: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '30px' }}>
                  <div onClick={() => fileInputRef.current.click()}
                    style={{ width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f5f5f5', border: '1px solid #ddd', cursor: 'pointer', position: 'relative', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {avatarSrc ? <img src={avatarSrc} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={44} color="#ccc" />}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '32px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera size={15} color="#fff" />
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={handleAvatarChange} />
                  <button type="button" onClick={() => fileInputRef.current.click()}
                    style={{ border: '1px solid #ddd', background: '#fff', padding: '7px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', color: '#555', marginBottom: '10px' }}>
                    Chọn Ảnh
                  </button>
                  {avatarFile && <div style={{ fontSize: '12px', color: '#ee4d2d', textAlign: 'center', marginBottom: '6px' }}>✓ {avatarFile.name}</div>}
                  <div style={{ fontSize: '12px', color: '#999', textAlign: 'center', lineHeight: '1.6' }}>Dụng lượng tối đa 1 MB<br />Định dạng: .JPEG, .PNG</div>
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB: Orders ══ */}
          {activeTab === 'orders' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>Đơn Hàng Của Tôi</h2>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
                  <Package size={48} color="#ddd" style={{ marginBottom: '12px' }} />
                  <div>Chưa có đơn hàng nào</div>
                </div>
              ) : orders.map((order, idx) => (
                <div key={idx} style={{ border: '1px solid #eee', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#fafafa', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Đơn #{order.id} <span style={{ fontWeight: '400', color: '#888' }}>— {new Date(order.orderDate).toLocaleDateString('vi-VN')}</span></span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div style={{ padding: '14px 18px' }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingBottom: i < order.items.length - 1 ? '12px' : '0', marginBottom: i < order.items.length - 1 ? '12px' : '0', borderBottom: i < order.items.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                        <div style={{ width: '54px', height: '54px', border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={item.imageUrl?.startsWith('http') ? item.imageUrl : `http://localhost:5188${item.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', color: '#333' }}>{item.productName}</div>
                          <div style={{ fontSize: '13px', color: '#888' }}>x{item.quantity}</div>
                        </div>
                        <div style={{ color: '#ee4d2d', fontSize: '14px', fontWeight: '600' }}>{formatPrice(item.unitPrice)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ backgroundColor: '#fffdf8', padding: '12px 18px', borderTop: '1px solid #eee', textAlign: 'right' }}>
                    <span style={{ fontSize: '14px', color: '#555', marginRight: '8px' }}>Tổng tiền:</span>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#ee4d2d' }}>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ TAB: Addresses ══ */}
          {activeTab === 'addresses' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px' }}>
              <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>Sổ địa chỉ</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Bạn muốn giao hàng đến địa chỉ khác?</p>
                <button
                  onClick={() => { setEditAddress(null); setShowAddressModal(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                >
                  <Plus size={16} /> Thêm địa chỉ mới
                </button>
              </div>

              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#aaa', border: '2px dashed #eee', borderRadius: '8px' }}>
                  <MapPin size={40} color="#ddd" style={{ marginBottom: '10px' }} />
                  <div>Chưa có địa chỉ nào. Hãy thêm địa chỉ nhận hàng đầu tiên!</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {addresses.map(addr => (
                    <div key={addr.id} style={{ border: `1px solid ${addr.isDefault ? '#2d6a4f' : '#eee'}`, borderRadius: '8px', padding: '18px', position: 'relative', backgroundColor: addr.isDefault ? '#f0faf4' : '#fff' }}>
                      {addr.isDefault && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#2d6a4f', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={11} /> Mặc định
                        </div>
                      )}
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>{addr.fullName}</div>
                      <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>📞 {addr.phone}</div>
                      <div style={{ fontSize: '14px', color: '#444', marginBottom: '10px', lineHeight: '1.5' }}>
                        {[addr.streetAddress, addr.ward, addr.district, addr.province].filter(Boolean).join(', ')}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', backgroundColor: '#f0f0f0', color: '#555', padding: '3px 10px', borderRadius: '12px' }}>{addr.addressType}</span>
                        <div style={{ flex: 1 }} />
                        {!addr.isDefault && (
                          <button onClick={() => handleSetDefault(addr.id)}
                            style={{ fontSize: '13px', color: '#2d6a4f', border: '1px solid #2d6a4f', background: '#fff', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                            Đặt mặc định
                          </button>
                        )}
                        <button onClick={() => { setEditAddress(addr); setShowAddressModal(true); }}
                          style={{ fontSize: '13px', color: '#1a73e8', border: '1px solid #1a73e8', background: '#fff', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                          Chỉnh sửa
                        </button>
                        <button onClick={() => handleDeleteAddress(addr.id)}
                          style={{ fontSize: '13px', color: '#e74c3c', border: '1px solid #e74c3c', background: '#fff', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Trash2 size={12} /> Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          customerId={customerInfo.id}
          editData={editAddress}
          onClose={() => { setShowAddressModal(false); setEditAddress(null); }}
          onSaved={() => { setShowAddressModal(false); setEditAddress(null); fetchAddresses(); }}
        />
      )}
    </div>
  );
}

export default ProfilePage;
