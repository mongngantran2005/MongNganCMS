import React from 'react';
import { Truck, Shield, RotateCcw } from 'lucide-react';

/**
 * ProductInfo - Thông tin sản phẩm: tên, giá, mô tả, tồn kho
 */
function ProductInfo({ product }) {
  if (!product) return null;

  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const oldPrice = product.price * 1.15;
  const discount = Math.round((1 - product.price / oldPrice) * 100);

  return (
    <div>
      {/* Category */}
      <div style={{ fontSize: '13px', color: '#ee4d2d', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
        {product.categoryName}
      </div>

      {/* Name */}
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', lineHeight: '1.4', marginBottom: '12px' }}>
        {product.name}
      </h1>

      {/* Rating placeholder */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1,2,3,4,5].map(s => (
            <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f5a623" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <span style={{ fontSize: '13px', color: '#888' }}>| Mã SP: {String(product.id).padStart(8, '0')}</span>
      </div>

      {/* Price */}
      <div style={{ backgroundColor: '#fff8f8', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '30px', fontWeight: '800', color: '#ee4d2d' }}>{formatPrice(product.price)}</span>
          <span style={{ fontSize: '16px', color: '#bbb', textDecoration: 'line-through' }}>{formatPrice(oldPrice)}</span>
          <span style={{ backgroundColor: '#ee4d2d', color: '#fff', fontSize: '13px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>
            -{discount}%
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#999' }}>Đã bao gồm VAT nếu có</div>
      </div>

      {/* Description */}
      {product.description && (
        <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.75', borderLeft: '3px solid #ee4d2d', paddingLeft: '14px', backgroundColor: '#fafafa', padding: '12px 14px', borderRadius: '0 6px 6px 0', marginBottom: '20px' }}>
          {product.description}
        </div>
      )}

      {/* Stock status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '20px' }}>
        <span style={{ color: '#555' }}>Tình trạng:</span>
        {product.stockQuantity > 0 ? (
          <span style={{ color: '#16a34a', fontWeight: '700' }}>✓ Còn hàng ({product.stockQuantity})</span>
        ) : (
          <span style={{ color: '#e74c3c', fontWeight: '700' }}>❌ Hết hàng</span>
        )}
      </div>

      {/* Shipping info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        {[
          { icon: <Truck size={16} color="#ee4d2d" />, text: 'Giao hàng nhanh trong ngày tại các chi nhánh' },
          { icon: <Shield size={16} color="#ee4d2d" />, text: 'Hàng chính hãng 100% - Hoàn tiền nếu giả' },
          { icon: <RotateCcw size={16} color="#ee4d2d" />, text: 'Đổi trả miễn phí trong 30 ngày' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#555' }}>
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductInfo;
