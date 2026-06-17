import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/userService';

/**
 * LoginForm - Form đăng nhập tái sử dụng
 */
function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    try {
      const data = await login(form);
      localStorage.setItem('customerInfo', JSON.stringify(data));
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '6px', fontSize: '14px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>
          Tên đăng nhập / Email
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="Nhập tên đăng nhập..."
          style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          autoComplete="username"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>
          Mật khẩu
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Nhập mật khẩu..."
          style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          autoComplete="current-password"
        />
      </div>

      <button
        id="login-submit-btn"
        type="submit"
        disabled={loading}
        style={{
          width: '100%', padding: '12px', backgroundColor: loading ? '#aaa' : 'var(--primary, #326e51)',
          color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px',
          fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
        }}
      >
        {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
      </button>
    </form>
  );
}

export default LoginForm;
