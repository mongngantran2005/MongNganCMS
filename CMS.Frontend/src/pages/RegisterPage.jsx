import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';

function RegisterPage() {
  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '480px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>
            Tạo Tài Khoản
          </h1>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Tạo tài khoản để nhận vô vàn ưu đãi hấp dẫn.
          </p>
        </div>

        <RegisterForm />

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#666', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: 'var(--primary, #326e51)', fontWeight: '700', textDecoration: 'none' }}>
            Đăng nhập ngay
          </Link>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;
