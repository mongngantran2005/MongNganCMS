import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5188';

function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/orders/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' });

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;
  if (!order) return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy đơn hàng!</div>;

  let statusText = 'CHỜ XỬ LÝ';
  let statusColor = '#FF6600';
  if (order.status === 0) { statusText = 'CHỜ XÁC NHẬN'; statusColor = '#FF6600'; }
  else if (order.status === 1) { statusText = 'CHỜ VẬN CHUYỂN'; statusColor = '#d97706'; }
  else if (order.status === 2) { statusText = 'CHỜ GIAO HÀNG'; statusColor = '#0284c7'; }
  else if (order.status === 3) { statusText = 'HOÀN THÀNH'; statusColor = '#16a34a'; }
  else if (order.status === 4) { statusText = 'ĐÃ HỦY'; statusColor = '#787878'; }
  else if (order.status === 5) { statusText = 'TRẢ HÀNG'; statusColor = '#be185d'; }

  return (
    <div style={{ backgroundColor: '#F1F1F5', minHeight: '80vh', padding: '40px 0', fontFamily: 'Inter, sans-serif' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <Link to="/profile" style={{ color: '#306E51', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
            &larr; Quay lại danh sách đơn hàng
          </Link>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '32px', boxShadow: 'rgba(20, 25, 26, 0.04) 0px 2px 8px 0px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EEEEEE', paddingBottom: '20px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#09090B' }}>Chi tiết đơn hàng #{order.id}</h2>
              <div style={{ fontSize: '14px', color: '#787878' }}>Đặt lúc: {formatDate(order.orderDate)}</div>
            </div>
            <div style={{ color: statusColor, fontWeight: '700', fontSize: '16px' }}>{statusText}</div>
          </div>

          <div style={{ display: 'flex', gap: '40px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333333' }}>Địa chỉ nhận hàng</h3>
              <div style={{ fontSize: '14px', color: '#09090B', lineHeight: '1.6' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{order.fullName || 'Khách hàng'}</div>
                <div style={{ color: '#787878', marginBottom: '4px' }}>SĐT: {order.phone || 'Không có'}</div>
                <div style={{ color: '#787878' }}>{order.shippingAddress || 'Không có'}</div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '250px', borderLeft: '1px solid #EEEEEE', paddingLeft: '40px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333333' }}>Phương thức thanh toán</h3>
              <div style={{ fontSize: '14px', color: '#09090B' }}>
                {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 
                 order.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' : 
                 order.paymentMethod || 'Không có'}
              </div>
              {order.notes && (
                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#333333' }}>Ghi chú</h3>
                  <div style={{ fontSize: '14px', color: '#787878' }}>{order.notes}</div>
                </div>
              )}
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#333333', borderBottom: '1px solid #EEEEEE', paddingBottom: '12px' }}>Sản phẩm</h3>
          <div>
            {order.items?.map(item => (
              <div key={item.productId} style={{ display: 'flex', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #F9F9F9' }}>
                <div style={{ width: '80px', height: '80px', border: '1px solid #CCCCCC', borderRadius: '6px', overflow: 'hidden' }}>
                  <img src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5188${item.imageUrl}`) : 'https://placehold.co/80'} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#09090B', lineHeight: '20px', marginBottom: '4px' }}>
                    {item.productName || `Sản phẩm mã #${item.productId}`}
                  </div>
                  <div style={{ fontSize: '12px', color: '#787878', marginBottom: '8px' }}>Phân loại: Mặc định</div>
                  <div style={{ fontSize: '14px', color: '#333333' }}>Số lượng: x{item.quantity}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', color: '#FF6600', fontWeight: '700' }}>{formatPrice(item.unitPrice)}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#787878' }}>
                <span>Tổng tiền hàng:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#787878' }}>
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #EEEEEE', fontSize: '16px', fontWeight: '700', color: '#333333' }}>
                <span>Thành tiền:</span>
                <span style={{ fontSize: '24px', color: '#FF6600' }}>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
