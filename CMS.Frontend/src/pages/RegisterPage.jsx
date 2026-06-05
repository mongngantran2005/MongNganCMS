import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = (e) => {
    e.preventDefault();
    api.post('/customers/register', formData)
      .then(res => {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Đăng ký thất bại');
      });
  };

  return (
    <div className="container section-padding" style={{ maxWidth: '500px' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Tạo Tài Khoản</h2>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Họ và tên</label>
            <input 
              type="text" name="fullName" required
              className="form-control"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
              value={formData.fullName} onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input 
              type="email" name="email" required
              className="form-control"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
              value={formData.email} onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Mật khẩu</label>
            <input 
              type="password" name="password" required
              className="form-control"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
              value={formData.password} onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Số điện thoại</label>
            <input 
              type="text" name="phone" required
              className="form-control"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
              value={formData.phone} onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Địa chỉ</label>
            <input 
              type="text" name="address" required
              className="form-control"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
              value={formData.address} onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1.1rem' }}>Đăng Ký</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary)' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
