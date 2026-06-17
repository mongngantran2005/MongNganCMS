import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/userService';

/**
 * RegisterForm - Form đăng ký tài khoản
 */
function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.username || !form.password) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    setLoading(true);
    try {
      await register({ fullName: form.fullName, email: form.email, username: form.username, password: form.password });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '6px', fontSize: '14px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
        <input id="reg-fullname" name="fullName" type="text" value={form.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Email</label>
        <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Tên đăng nhập <span style={{ color: 'red' }}>*</span></label>
        <input id="reg-username" name="username" type="text" value={form.username} onChange={handleChange} placeholder="username123" style={inputStyle} autoComplete="username" />
      </div>
      <div>
        <label style={labelStyle}>Mật khẩu <span style={{ color: 'red' }}>*</span></label>
        <input id="reg-password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Ít nhất 6 ký tự" style={inputStyle} autoComplete="new-password" />
      </div>
      <div>
        <label style={labelStyle}>Xác nhận mật khẩu <span style={{ color: 'red' }}>*</span></label>
        <input id="reg-confirm-password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu" style={inputStyle} autoComplete="new-password" />
      </div>

      <button
        id="register-submit-btn"
        type="submit"
        disabled={loading}
        style={{
          width: '100%', padding: '12px',
          backgroundColor: loading ? '#aaa' : 'var(--primary, #326e51)',
          color: '#fff', border: 'none', borderRadius: '6px',
          fontSize: '15px', fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
        }}
      >
        {loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
      </button>
    </form>
  );
}

export default RegisterForm;
