import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/userService';
import { getMyOrders } from '../services/orderService';
import { User, ShoppingBag, MapPin, Key, LogOut, Camera } from 'lucide-react';

function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', address: '', avatarUrl: '' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load init data
  useEffect(() => {
    const customerInfo = localStorage.getItem('customerInfo');
    if (!customerInfo) {
      navigate('/login');
      return;
    }

    Promise.all([getProfile(), getMyOrders()])
      .then(([profData, ordData]) => {
        setProfile(profData);
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
      await updateProfile({ fullName: profile.fullName, phone: profile.phone, address: profile.address });
      
      const cInfo = JSON.parse(localStorage.getItem('customerInfo'));
      cInfo.fullName = profile.fullName;
      localStorage.setItem('customerInfo', JSON.stringify(cInfo));
      window.dispatchEvent(new Event('storage'));
      
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert('Cập nhật thất bại!');
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerInfo');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' });

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh', padding: '40px 0' }}>
      <div className="container" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Sidebar */}
        <div style={{ width: '280px', backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 12px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#e0e0e0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://localhost:5188${profile.avatarUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={36} color="#999" />
                )}
              </div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#333' }}>{profile.fullName}</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{profile.email}</p>
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
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeTab === item.id ? '#f0faf5' : 'transparent', color: activeTab === item.id ? 'var(--primary, #326e51)' : '#555', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === item.id ? '700' : '500', transition: 'all 0.2s', fontFamily: 'inherit' }}
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ))}
            <li>
              <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'transparent', color: '#e30019', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                <LogOut size={18} /> Đăng xuất
              </button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minHeight: '500px' }}>
          
          {activeTab === 'info' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>Thông Tin Tài Khoản</h2>
              <form onSubmit={handleUpdateProfile} style={{ maxWidth: '500px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Họ và tên</label>
                  <input type="text" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Email (Không thể thay đổi)</label>
                  <input type="text" value={profile.email} disabled style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', backgroundColor: '#f9f9f9', color: '#888' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Số điện thoại</label>
                  <input type="text" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
                </div>
                <button type="submit" style={{ padding: '12px 24px', backgroundColor: 'var(--primary, #326e51)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>
                  Lưu Thay Đổi
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>Đơn Hàng Của Tôi</h2>
              
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                  <ShoppingBag size={48} color="#ddd" style={{ marginBottom: '16px' }} />
                  <p>Bạn chưa có đơn hàng nào.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map(o => (
                    <div key={o.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#fafafa', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                        <div><strong>Mã đơn:</strong> #{o.id} <span style={{ color: '#888', marginLeft: '10px' }}>{formatDate(o.createdAt)}</span></div>
                        <div style={{ color: o.status === 'Pending' ? '#f59e0b' : '#16a34a', fontWeight: '700' }}>{o.status === 'Pending' ? 'Đang chờ xử lý' : o.status}</div>
                      </div>
                      <div style={{ padding: '20px' }}>
                        {o.orderItems?.map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <span style={{ fontWeight: '600' }}>{item.quantity}x</span>
                              <span style={{ color: '#555' }}>Sản phẩm ID: {item.productId}</span>
                            </div>
                            <span style={{ fontWeight: '500' }}>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ backgroundColor: '#fff', padding: '16px 20px', textAlign: 'right', borderTop: '1px solid #eee' }}>
                        <span style={{ fontSize: '14px', color: '#555' }}>Tổng tiền: </span>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#e30019' }}>{formatPrice(o.totalAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(activeTab === 'address' || activeTab === 'password') && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <p>Tính năng đang được cập nhật...</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
