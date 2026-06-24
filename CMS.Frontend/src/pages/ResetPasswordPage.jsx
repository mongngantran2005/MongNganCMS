import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError('Đường dẫn không hợp lệ hoặc thiếu thông tin xác thực.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.post('/customers/reset-password', {
        email,
        token,
        newPassword
      });
      setMessage(res.data.message || 'Đặt lại mật khẩu thành công!');
      setSuccess(true);
      // Chuyển hướng sau 3 giây
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, token có thể đã hết hạn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div style={{ backgroundColor: '#f1f5f9', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#fff', borderRadius: '12px', padding: '40px 30px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Lỗi Xác Thực</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Đường dẫn khôi phục mật khẩu không hợp lệ.</p>
          <Link to="/forgot-password" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#306E51', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: '600' }}>
            Yêu cầu lại link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#fff', borderRadius: '12px', padding: '40px 30px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>
          Đặt Lại Mật Khẩu
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>
          Vui lòng nhập mật khẩu mới cho tài khoản <br/><b>{email}</b>
        </p>

        {message && (
          <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #bbf7d0', display: 'flex', gap: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>✓</span>
            <div>
              {message} <br/> Đang chuyển hướng đến trang đăng nhập...
            </div>
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #fecaca', display: 'flex', gap: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>⚠</span>
            <div>{error}</div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#334155', fontWeight: '600', fontSize: '13px' }}>
                Mật khẩu mới <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setError(''); }}
                required
                style={{ 
                  width: '100%', padding: '12px 14px', borderRadius: '8px', 
                  border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s',
                  fontSize: '14px', boxSizing: 'border-box'
                }}
                placeholder="Nhập mật khẩu mới..."
                onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = '0 0 0 3px rgba(48,110,81,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#334155', fontWeight: '600', fontSize: '13px' }}>
                Xác nhận mật khẩu mới <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                required
                style={{ 
                  width: '100%', padding: '12px 14px', borderRadius: '8px', 
                  border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s',
                  fontSize: '14px', boxSizing: 'border-box'
                }}
                placeholder="Nhập lại mật khẩu..."
                onFocus={e => { e.target.style.borderColor = '#306E51'; e.target.style.boxShadow = '0 0 0 3px rgba(48,110,81,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !newPassword || !confirmPassword}
              style={{ 
                width: '100%', padding: '14px', 
                backgroundColor: (loading || !newPassword || !confirmPassword) ? '#94a3b8' : '#FF6600', 
                color: '#fff', border: 'none', borderRadius: '8px', 
                cursor: (loading || !newPassword || !confirmPassword) ? 'not-allowed' : 'pointer', 
                fontWeight: '600', fontSize: '15px', transition: 'background-color 0.2s'
              }}>
              {loading ? 'Đang xử lý...' : 'Xác Nhận Đổi Mật Khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
