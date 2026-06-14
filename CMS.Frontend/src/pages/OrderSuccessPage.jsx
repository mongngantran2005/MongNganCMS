import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

function OrderSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '50px 40px', textAlign: 'center', maxWidth: '480px', width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {/* Success Icon */}
        <div style={{ width: '80px', height: '80px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={48} color="#16a34a" />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '10px' }}>Đặt hàng thành công!</h1>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến tay bạn.
        </p>

        {orderId && (
          <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '14px 20px', marginBottom: '28px', border: '1px solid #eee' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Mã đơn hàng</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#ee4d2d' }}>#{orderId}</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/profile" state={{ tab: 'orders' }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#ee4d2d', color: '#fff', padding: '13px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '700' }}>
            <Package size={18} /> Xem đơn hàng của tôi
          </Link>
          <Link to="/products"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#fff', color: '#333', padding: '13px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', border: '1px solid #ddd' }}>
            Tiếp tục mua sắm <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
