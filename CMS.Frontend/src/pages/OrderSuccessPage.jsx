import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function OrderSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId || 'N/A';

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '50px 30px', textAlign: 'center', maxWidth: '500px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={48} color="#16a34a" />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px' }}>
          Đặt Hàng Thành Công!
        </h1>
        
        <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.6', marginBottom: '24px' }}>
          Cảm ơn bạn đã mua sắm tại MongNganCMS. Đơn hàng của bạn đang được xử lý.
        </p>

        <div style={{ backgroundColor: '#fafafa', border: '1px dashed #ddd', borderRadius: '8px', padding: '16px', marginBottom: '32px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Mã đơn hàng của bạn:</span>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary, #326e51)', marginTop: '8px', letterSpacing: '1px' }}>
            #{orderId}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/products" style={{ flex: 1, textDecoration: 'none', padding: '14px', backgroundColor: 'var(--primary, #326e51)', color: '#fff', borderRadius: '8px', fontWeight: '700', fontSize: '15px', transition: 'background 0.2s' }}>
            Tiếp Tục Mua Sắm
          </Link>
          <Link to="/profile" style={{ flex: 1, textDecoration: 'none', padding: '14px', backgroundColor: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '8px', fontWeight: '700', fontSize: '15px', transition: 'background 0.2s' }}>
            Xem Đơn Hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
