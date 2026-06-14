import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phone: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    api.post('/customers/register', formData)
      .then(() => {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Đăng ký thất bại');
        setLoading(false);
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Tạo Tài Khoản</h2>
        <p className="auth-subtitle">Đăng ký để nhận ưu đãi độc quyền!</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Họ và tên</label>
            <input type="text" name="fullName" required className="form-input"
              placeholder="Nguyễn Văn A" value={formData.fullName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" required className="form-input"
              placeholder="email@example.com" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input type="password" name="password" required className="form-input"
              placeholder="Tối thiểu 6 ký tự" value={formData.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input type="text" name="phone" required className="form-input"
              placeholder="0901 234 567" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ</label>
            <input type="text" name="address" required className="form-input"
              placeholder="Số nhà, đường, quận, thành phố" value={formData.address} onChange={handleChange} />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng Ký Ngay'}
          </button>
        </form>

        <p className="auth-footer-text">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
