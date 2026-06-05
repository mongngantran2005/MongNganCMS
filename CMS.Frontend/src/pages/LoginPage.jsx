import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    api.post('/customers/login', { email, password })
      .then(res => {
        localStorage.setItem('customerInfo', JSON.stringify(res.data));
        navigate('/');
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Đăng nhập thất bại');
      });
  };

  return (
    <div className="container section-padding" style={{ maxWidth: '500px' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input 
              type="email" 
              required
              className="form-control"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Mật khẩu</label>
            <input 
              type="password" 
              required
              className="form-control"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1.1rem' }}>Đăng nhập</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary)' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
