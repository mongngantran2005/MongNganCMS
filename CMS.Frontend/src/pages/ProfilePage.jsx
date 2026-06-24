import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile, updateProfile, changePassword } from '../services/userService';
import { getMyOrders } from '../services/orderService';
import { User, ShoppingBag, MapPin, Key, LogOut, Camera, Truck } from 'lucide-react';
import AddressBook from '../components/Profile/AddressBook';

function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', address: '', avatarUrl: '', gender: 'Nam', dateOfBirth: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [orderTab, setOrderTab] = useState('all');
  
  // Change password state
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // Load init data
  useEffect(() => {
    const customerInfo = localStorage.getItem('customerInfo');
    if (!customerInfo) {
      navigate('/login');
      return;
    }

    Promise.all([getProfile(), getMyOrders()])
      .then(([profData, ordData]) => {
        // Chuẩn hóa dữ liệu: đảm bảo các trường không bị null/undefined
        setProfile({
          fullName: profData.fullName || '',
          email: profData.email || '',
          username: profData.username || profData.email?.split('@')[0] || '',
          phone: profData.phone || '',
          address: profData.address || '',
          gender: profData.gender || 'Nam',
          dateOfBirth: profData.dateOfBirth || '',
          avatarUrl: profData.avatarUrl || '',
        });
        setOrders(ordData.sort((a,b) => b.id - a.id));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem('customerInfo');
          navigate('/login');
        }
        setLoading(false);
      });
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('FullName', profile.fullName || '');
      formData.append('Phone', profile.phone || '');
      formData.append('Address', profile.address || '');
      formData.append('Username', profile.username || '');
      formData.append('Gender', profile.gender || 'Nam');
      if (profile.dateOfBirth) {
        formData.append('DateOfBirth', profile.dateOfBirth.split('T')[0]);
      }
      if (avatarFile) {
        formData.append('AvatarFile', avatarFile);
      }

      const res = await updateProfile(formData);
      
      const cInfo = JSON.parse(localStorage.getItem('customerInfo'));
      cInfo.fullName = profile.fullName;
      if (res.avatarUrl) {
        cInfo.avatarUrl = res.avatarUrl;
        setProfile(prev => ({...prev, avatarUrl: res.avatarUrl}));
      }
      localStorage.setItem('customerInfo', JSON.stringify(cInfo));
      window.dispatchEvent(new Event('storage'));
      
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert('Cập nhật thất bại!');
      console.error(error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerInfo');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    try {
      await changePassword({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
      alert('Đổi mật khẩu thành công!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Đổi mật khẩu thất bại!');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    try {
      const response = await fetch(`http://localhost:5188/api/orders/${orderId}/cancel`, {
        method: 'PUT'
      });
      if (response.ok) {
        alert("Hủy đơn hàng thành công!");
        const ordData = await getMyOrders();
        setOrders(ordData.sort((a,b) => b.id - a.id));
      } else {
        alert("Không thể hủy đơn hàng lúc này.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối.");
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' });

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;

  return (
    <div style={{ backgroundColor: '#F1F1F5', minHeight: '80vh', padding: '40px 0', fontFamily: 'Inter, sans-serif' }}>
      <div className="container" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Sidebar */}
        <div style={{ width: '280px', backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: 'rgba(20, 25, 26, 0.04) 0px 2px 8px 0px' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid #CCCCCC', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 12px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#F1F1F5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : profile.avatarUrl ? (
                  <img src={profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://localhost:5188${profile.avatarUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={36} color="#999" />
                )}
              </div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: '#09090B' }}>{profile.fullName}</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#787878' }}>{profile.email}</p>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'info', icon: <User size={18} />, label: 'Thông tin tài khoản' },
              { id: 'orders', icon: <ShoppingBag size={18} />, label: 'Quản lý đơn hàng' },
              { id: 'address', icon: <MapPin size={18} />, label: 'Sổ địa chỉ' },
              { id: 'password', icon: <Key size={18} />, label: 'Đổi mật khẩu' },
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeTab === item.id ? '#CFEADD' : 'transparent', color: activeTab === item.id ? '#306E51' : '#333333', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === item.id ? '600' : '500', fontSize: '14px', transition: 'all 0.2s', fontFamily: 'inherit' }}
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ))}
            <li>
              <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'transparent', color: '#FF235C', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                <LogOut size={18} /> Đăng xuất
              </button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '32px', boxShadow: 'rgba(20, 25, 26, 0.04) 0px 2px 8px 0px', minHeight: '500px' }}>
          
          {activeTab === 'info' && (
            <div>
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid #CCCCCC', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#09090B', margin: '0 0 4px 0' }}>Hồ Sơ Của Tôi</h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#787878' }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>

              <div style={{ display: 'flex' }}>
                {/* Cột trái */}
                <div style={{ flex: '1', paddingRight: '50px', borderRight: '1px solid #CCCCCC' }}>
                  <form onSubmit={handleUpdateProfile}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ width: '140px', textAlign: 'right', paddingRight: '20px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Tên đăng nhập</div>
                      <div style={{ flex: '1', fontSize: '14px', color: '#09090B', fontWeight: '500' }}>{profile.username || profile.email?.split('@')[0] || '_user'}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ width: '140px', textAlign: 'right', paddingRight: '20px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Tên</div>
                      <div style={{ flex: '1' }}>
                        <input type="text" value={profile.fullName || ''} onChange={e => setProfile({...profile, fullName: e.target.value})} style={{ width: '100%', padding: '10px 20px', border: '1px solid #CCCCCC', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#333333', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ width: '140px', textAlign: 'right', paddingRight: '20px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Email</div>
                      <div style={{ flex: '1', fontSize: '14px', color: '#09090B' }}>
                        {profile.email} 
                        <span style={{ color: '#306E51', marginLeft: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Thay Đổi</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ width: '140px', textAlign: 'right', paddingRight: '20px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Số điện thoại</div>
                      <div style={{ flex: '1', fontSize: '14px', color: '#09090B', display: 'flex', alignItems: 'center' }}>
                        {isEditingPhone ? (
                          <input type="text" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} style={{ width: '200px', padding: '10px 20px', border: '1px solid #CCCCCC', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#333333', transition: 'all 0.2s' }} autoFocus onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; setIsEditingPhone(false); }} />
                        ) : (
                          <>
                            {profile.phone ? `********${profile.phone.slice(-2)}` : 'Chưa cập nhật'}
                            <span onClick={() => setIsEditingPhone(true)} style={{ color: '#306E51', marginLeft: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Thay Đổi</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ width: '140px', textAlign: 'right', paddingRight: '20px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Giới tính</div>
                      <div style={{ flex: '1', display: 'flex', gap: '20px', fontSize: '14px', color: '#09090B' }}>
                        {['Nam', 'Nữ', 'Khác'].map(g => (
                          <label key={g} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="radio" name="gender" value={g} checked={profile.gender === g} onChange={e => setProfile({...profile, gender: e.target.value})} style={{ marginRight: '6px', accentColor: '#306E51' }} />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                      <div style={{ width: '140px', textAlign: 'right', paddingRight: '20px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Ngày sinh</div>
                      <div style={{ flex: '1' }}>
                        <input type="date" value={profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''} onChange={e => setProfile({...profile, dateOfBirth: e.target.value})} style={{ padding: '10px 20px', border: '1px solid #CCCCCC', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#333333', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '140px', paddingRight: '20px' }}></div>
                      <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#306E51', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', boxShadow: 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#276244'; e.target.style.boxShadow = 'rgba(20, 25, 26, 0.12) 0px 8px 24px 0px'; }} onMouseLeave={e => { e.target.style.backgroundColor = '#306E51'; e.target.style.boxShadow = 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px'; }}>
                        Lưu Thay Đổi
                      </button>
                    </div>
                  </form>
                </div>

                {/* Cột phải */}
                <div style={{ width: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#F1F1F5', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #CCCCCC' }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : profile.avatarUrl ? (
                      <img src={profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://localhost:5188${profile.avatarUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={48} color="#CCCCCC" />
                    )}
                  </div>
                  
                  <label style={{ padding: '8px 16px', border: '1px solid #306E51', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: '#306E51', backgroundColor: 'transparent', marginBottom: '16px', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#CFEADD'; }} onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}>
                    Chọn Ảnh
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={handleAvatarChange} style={{ display: 'none' }} />
                  </label>
                  
                  <div style={{ fontSize: '12px', color: '#787878', textAlign: 'center', lineHeight: '1.5' }}>
                    Dung lượng file tối đa 1 MB<br />Định dạng: .JPEG, .PNG
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={{ flex: 1, backgroundColor: '#F1F1F5', borderRadius: '12px', padding: '0', minHeight: '500px', overflow: 'hidden' }}>
              {/* Tabs Đơn Hàng */}
              <div style={{ display: 'flex', borderBottom: '1px solid #CCCCCC', backgroundColor: '#FFFFFF', position: 'sticky', top: '0', zIndex: 10 }}>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'pending', label: 'Chờ xác nhận' },
                  { id: 'shipping', label: 'Chờ vận chuyển' },
                  { id: 'delivering', label: 'Chờ giao hàng' },
                  { id: 'completed', label: 'Hoàn thành' },
                  { id: 'cancelled', label: 'Đã hủy' },
                  { id: 'return', label: 'Trả hàng' }
                ].map(tab => (
                  <div
                    key={tab.id}
                    onClick={() => setOrderTab(tab.id)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '12px 0',
                      fontSize: '14px',
                      cursor: 'pointer',
                      color: orderTab === tab.id ? '#306E51' : '#333333',
                      borderBottom: orderTab === tab.id ? '2px solid #306E51' : '2px solid transparent',
                      transition: 'all 0.2s',
                      fontWeight: orderTab === tab.id ? '600' : '500',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => { if (orderTab !== tab.id) { e.target.style.color = '#306E51'; e.target.style.borderBottom = '2px solid #CCCCCC'; } }}
                    onMouseLeave={e => { if (orderTab !== tab.id) { e.target.style.color = '#333333'; e.target.style.borderBottom = '2px solid transparent'; } }}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>

              {/* Search Bar */}
              <div style={{ padding: '16px', backgroundColor: '#F1F1F5', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '10px', color: '#787878' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input type="text" placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm" style={{ width: '100%', padding: '10px 20px 10px 40px', border: '1px solid #CCCCCC', borderRadius: '6px', backgroundColor: '#FFFFFF', fontSize: '14px', color: '#333333', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>

              {/* Order List */}
              <div style={{ padding: '12px 0' }}>
                {orders.filter(o => {
                  if (orderTab === 'all') return true;
                  if (orderTab === 'pending') return o.status === 0;
                  if (orderTab === 'shipping') return o.status === 1;
                  if (orderTab === 'delivering') return o.status === 2;
                  if (orderTab === 'completed') return o.status === 3;
                  if (orderTab === 'cancelled') return o.status === 4;
                  if (orderTab === 'return') return o.status === 5;
                  return true;
                }).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: '#fff', borderRadius: '4px', margin: '0 12px' }}>
                    <ShoppingBag size={64} color="#ddd" style={{ marginBottom: '16px' }} />
                    <p style={{ color: '#888', fontSize: '15px' }}>Chưa có đơn hàng</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {orders.filter(o => {
                      if (orderTab === 'all') return true;
                      if (orderTab === 'pending') return o.status === 0;
                      if (orderTab === 'shipping') return o.status === 1;
                      if (orderTab === 'delivering') return o.status === 2;
                      if (orderTab === 'completed') return o.status === 3;
                      if (orderTab === 'cancelled') return o.status === 4;
                      if (orderTab === 'return') return o.status === 5;
                      return true;
                    }).map(o => {
                      let statusText = 'CHỜ XỬ LÝ';
                      let statusColor = '#FF6600';
                      let statusIcon = <Truck size={14} />;
                      let statusMessage = 'Đang chuẩn bị hàng';
                      
                      if (o.status === 0) { statusText = 'CHỜ XÁC NHẬN'; statusColor = '#FF6600'; statusMessage = 'Đơn hàng đang chờ xác nhận'; }
                      else if (o.status === 1) { statusText = 'CHỜ VẬN CHUYỂN'; statusColor = '#d97706'; statusMessage = 'Người bán đang chuẩn bị hàng'; }
                      else if (o.status === 2) { statusText = 'CHỜ GIAO HÀNG'; statusColor = '#0284c7'; statusMessage = 'Đơn hàng đang được giao'; }
                      else if (o.status === 3) { statusText = 'HOÀN THÀNH'; statusColor = '#16a34a'; statusMessage = 'Giao hàng thành công'; }
                      else if (o.status === 4) { statusText = 'ĐÃ HỦY'; statusColor = '#787878'; statusMessage = 'Đơn hàng đã bị hủy'; }
                      else if (o.status === 5) { statusText = 'TRẢ HÀNG'; statusColor = '#be185d'; statusMessage = 'Đơn hàng bị trả lại'; }

                      return (
                      <div key={o.id} style={{ backgroundColor: '#FFFFFF', padding: '0 24px', boxShadow: 'rgba(20, 25, 26, 0.04) 0px 2px 8px 0px', borderRadius: '12px', border: '1px solid #EEEEEE', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px'; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = 'rgba(20, 25, 26, 0.04) 0px 2px 8px 0px'; }}>
                        {/* Header: Shop & Status */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F1F1F5' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ backgroundColor: '#FF6600', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px' }}>Mall</span>
                            <span style={{ fontWeight: '700', fontSize: '14px', color: '#09090B' }}>Hasaki Official Store</span>
                            <button style={{ border: '1px solid #306E51', color: '#306E51', backgroundColor: 'transparent', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#CFEADD'; }} onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Chat
                            </button>
                            <Link to={`/order/${o.id}`} style={{ border: '1px solid #CCCCCC', color: '#333333', backgroundColor: 'transparent', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#F1F1F5'; }} onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Xem Chi Tiết
                            </Link>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: statusColor, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {statusIcon} {statusMessage}
                            </span>
                            <span style={{ color: '#CCCCCC' }}>|</span>
                            <span style={{ color: statusColor, fontWeight: '700', fontSize: '14px', textTransform: 'uppercase' }}>
                              {statusText}
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div style={{ padding: '16px 0', borderBottom: '1px solid #F1F1F5' }}>
                          {o.items?.map(item => {
                            const origPrice = Math.round(item.unitPrice * 1.15 / 1000) * 1000;
                            return (
                              <div key={item.productId} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ width: '80px', height: '80px', border: '1px solid #CCCCCC', borderRadius: '6px', overflow: 'hidden' }}>
                                  <img src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5188${item.imageUrl}`) : 'https://placehold.co/80'} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '14px', color: '#09090B', lineHeight: '20px', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {item.productName || `Sản phẩm mã #${item.productId}`}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#787878', marginBottom: '8px' }}>Phân loại hàng: Mặc định</div>
                                  <div style={{ fontSize: '14px', color: '#333333' }}>x{item.quantity}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'center' }}>
                                  <span style={{ fontSize: '12px', color: '#787878', textDecoration: 'line-through' }}>{formatPrice(origPrice)}</span>
                                  <span style={{ fontSize: '14px', color: '#FF6600', fontWeight: '700' }}>{formatPrice(item.unitPrice)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Total & Actions */}
                        <div style={{ padding: '20px 0' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
                            <span style={{ fontSize: '14px', color: '#333333' }}>Thành tiền:</span>
                            <span style={{ fontSize: '24px', fontWeight: '700', color: '#FF6600' }}>{formatPrice(o.totalAmount)}</span>
                          </div>
                          
                          {o.status === 3 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: '12px', color: '#787878', lineHeight: '16px' }}>
                                Đánh giá sản phẩm trước <span style={{ color: '#306E51', textDecoration: 'underline' }}>{formatDate(new Date(new Date(o.orderDate || new Date()).getTime() + 7*24*60*60*1000))}</span><br/>
                                <span style={{ color: '#FF6600' }}>Đánh giá ngay và nhận Xu thưởng</span>
                              </div>
                              <div style={{ display: 'flex', gap: '12px' }}>
                                <button style={{ height: '40px', padding: '0 24px', backgroundColor: '#306E51', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px', whiteSpace: 'nowrap' }}
                                  onMouseEnter={e => { e.target.style.backgroundColor = '#276244'; e.target.style.boxShadow = 'rgba(20, 25, 26, 0.12) 0px 8px 24px 0px'; }}
                                  onMouseLeave={e => { e.target.style.backgroundColor = '#306E51'; e.target.style.boxShadow = 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px'; }}
                                >
                                  Đánh Giá
                                </button>
                                <button style={{ height: '40px', padding: '0 20px', backgroundColor: 'transparent', color: '#333333', border: '1px solid #CCCCCC', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                                  onMouseEnter={e => { e.target.style.backgroundColor = '#F1F1F5'; e.target.style.borderColor = '#999999'; }}
                                  onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = '#CCCCCC'; }}
                                >
                                  Yêu Cầu Trả Hàng/Hoàn Tiền
                                </button>
                                <button style={{ height: '40px', padding: '0 16px', backgroundColor: 'transparent', color: '#333333', border: '1px solid #CCCCCC', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                                  onMouseEnter={e => { e.target.style.backgroundColor = '#F1F1F5'; e.target.style.borderColor = '#999999'; }}
                                  onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = '#CCCCCC'; }}
                                >
                                  Mua Lại <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                              </div>
                            </div>
                          )}

                          {o.status === 0 && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => handleCancelOrder(o.id)} style={{ height: '40px', padding: '0 20px', backgroundColor: 'transparent', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                                  onMouseEnter={e => { e.target.style.backgroundColor = '#fef2f2'; }}
                                  onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}
                                >
                                  Hủy Đơn Hàng
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <AddressBook />
          )}

          {activeTab === 'password' && (
            <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '20px' }}>
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid #CCCCCC', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#09090B', margin: '0 0 4px 0' }}>Đổi Mật Khẩu</h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#787878' }}>Vui lòng nhập mật khẩu cũ và mật khẩu mới</p>
              </div>
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Mật khẩu hiện tại</label>
                  <input type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} required style={{ width: '100%', padding: '10px 20px', border: '1px solid #CCCCCC', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#333333', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Mật khẩu mới</label>
                  <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required minLength="6" style={{ width: '100%', padding: '10px 20px', border: '1px solid #CCCCCC', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#333333', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#333333' }}>Xác nhận mật khẩu mới</label>
                  <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} required minLength="6" style={{ width: '100%', padding: '10px 20px', border: '1px solid #CCCCCC', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#333333', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = 'rgba(48, 110, 81, 0.2) 0px 0px 0px 4px'; }} onBlur={e => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px 24px', backgroundColor: '#306E51', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', boxShadow: 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#276244'; e.target.style.boxShadow = 'rgba(20, 25, 26, 0.12) 0px 8px 24px 0px'; }} onMouseLeave={e => { e.target.style.backgroundColor = '#306E51'; e.target.style.boxShadow = 'rgba(20, 25, 26, 0.08) 0px 4px 16px 0px'; }}>
                  Lưu thay đổi
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
