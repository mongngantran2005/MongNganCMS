import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, MapPin, RotateCcw, Truck, Shield, ChevronLeft, Minus, Plus } from 'lucide-react';
import api from '../api';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const getImg = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:5188${url}`;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const addToCart = (goToCart = true) => {
    if (!product) return;
    if (product.stockQuantity <= 0) {
      alert('Sản phẩm này đã hết hàng!');
      return;
    }
    const customerInfo = localStorage.getItem('customerInfo');
    if (!customerInfo) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      if (existing.quantity + quantity > product.stockQuantity) {
        alert(`Không đủ tồn kho! Bạn chỉ có thể mua tối đa ${product.stockQuantity} sản phẩm này.`);
        return;
      }
      existing.quantity += quantity;
    } else {
      if (quantity > product.stockQuantity) {
        alert(`Không đủ tồn kho! Bạn chỉ có thể mua tối đa ${product.stockQuantity} sản phẩm này.`);
        return;
      }
      cart.push({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    if (goToCart) navigate('/cart');
    else alert('Đã thêm vào giỏ hàng!');
  };

  if (!product) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#666' }}>
      Đang tải thông tin sản phẩm...
    </div>
  );

  const imgUrl = getImg(product.imageUrl);
  const oldPrice = product.price * 1.15;
  const discount = Math.round((1 - product.price / oldPrice) * 100);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee', padding: '10px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888' }}>
            <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
            <span>/</span>
            <Link to="/products" style={{ color: '#888', textDecoration: 'none' }}>Sản phẩm</Link>
            <span>/</span>
            <span style={{ color: '#333' }}>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {/* LEFT: Image Gallery */}
          <div style={{ width: '400px', flexShrink: 0 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              {/* Main Image */}
              <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', border: '1px solid #f0f0f0', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fafafa' }}>
                {imgUrl ? (
                  <img src={imgUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ color: '#ccc', fontSize: '14px' }}>Không có ảnh</div>
                )}
              </div>

              {/* Thumbnails (hiện tại chỉ có 1 ảnh, hiển thị lại như thu nhỏ) */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <div style={{ width: '60px', height: '60px', border: '2px solid var(--primary, #ee4d2d)', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer' }}>
                  {imgUrl && <img src={imgUrl} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Product Info */}
          <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            {/* Brand / Category */}
            <div style={{ fontSize: '13px', color: '#ee4d2d', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {product.categoryName || 'Sản phẩm'}
            </div>

            {/* Product Name */}
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', lineHeight: '1.4', marginBottom: '6px' }}>
              {product.name}
            </h1>

            {/* Rating placeholder */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f5a623" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: '13px', color: '#888' }}>| Mã SP: {product.id?.toString().padStart(8, '0')}</span>
            </div>

            {/* Price Section */}
            <div style={{ backgroundColor: '#fff8f8', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#ee4d2d' }}>
                  {formatPrice(product.price)}
                </span>
                <span style={{ fontSize: '16px', color: '#bbb', textDecoration: 'line-through' }}>
                  {formatPrice(oldPrice)}
                </span>
                <span style={{ backgroundColor: '#ee4d2d', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>
                  -{discount}%
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#888' }}>Đã bao gồm VAT</div>
            </div>

            {/* Description */}
            {product.description && (
              <div style={{ marginBottom: '20px', fontSize: '14px', color: '#555', lineHeight: '1.7', borderLeft: '3px solid #ee4d2d', paddingLeft: '12px', backgroundColor: '#fafafa', padding: '12px 12px 12px 15px', borderRadius: '0 6px 6px 0' }}>
                {product.description}
              </div>
            )}

            {/* Stock */}
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <span style={{ color: '#555' }}>Tình trạng:</span>
              {product.stockQuantity > 0 ? (
                <span style={{ color: '#27ae60', fontWeight: '600' }}>
                  ✓ Còn hàng ({product.stockQuantity} sản phẩm)
                </span>
              ) : (
                <span style={{ color: '#e74c3c', fontWeight: '600' }}>❌ Hết hàng</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>Số lượng:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stockQuantity === 0}
                  style={{ width: '36px', height: '36px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ width: '50px', textAlign: 'center', fontSize: '15px', fontWeight: '600', lineHeight: '36px' }}>
                  {product.stockQuantity === 0 ? 0 : quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={product.stockQuantity === 0}
                  style={{ width: '36px', height: '36px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => addToCart(false)}
                disabled={product.stockQuantity === 0}
                style={{
                  flex: 1, height: '48px', border: '2px solid #ee4d2d',
                  backgroundColor: '#fff', color: '#ee4d2d',
                  borderRadius: '6px', fontSize: '15px', fontWeight: '600',
                  cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: product.stockQuantity === 0 ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { if (product.stockQuantity > 0) e.currentTarget.style.backgroundColor = '#fff5f5'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; }}
              >
                <ShoppingCart size={18} /> GIỎ HÀNG
              </button>
              <button
                onClick={() => addToCart(true)}
                disabled={product.stockQuantity === 0}
                style={{
                  flex: 1, height: '48px', border: 'none',
                  backgroundColor: product.stockQuantity === 0 ? '#ccc' : '#ee4d2d',
                  color: '#fff', borderRadius: '6px', fontSize: '15px', fontWeight: '600',
                  cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { if (product.stockQuantity > 0) e.currentTarget.style.backgroundColor = '#d44426'; }}
                onMouseLeave={e => { if (product.stockQuantity > 0) e.currentTarget.style.backgroundColor = '#ee4d2d'; }}
              >
                {product.stockQuantity === 0 ? 'HẾT HÀNG' : 'MUA NGAY'}
              </button>
            </div>
          </div>

          {/* RIGHT: Shipping Info */}
          <div style={{ width: '240px', flexShrink: 0 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '15px' }}>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#ee4d2d' }}>—</span> MIỄN PHÍ VẬN CHUYỂN <span style={{ color: '#ee4d2d' }}>—</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Truck size={18} color="#ee4d2d" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '2px' }}>Giao Hàng Nhanh</div>
                    <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.5' }}>Giao hàng nhanh trong ngày tại các chi nhánh</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={18} color="#ee4d2d" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '2px' }}>Hàng Chính Hãng 100%</div>
                    <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.5' }}>Bồi hoàn 100% nếu phát hiện hàng giả</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <RotateCcw size={18} color="#ee4d2d" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '2px' }}>Đổi Trả 30 Ngày</div>
                    <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.5' }}>Đổi trả miễn phí trong vòng 30 ngày</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back button */}
            <Link
              to="/products"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '13px', padding: '12px 16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
            >
              <ChevronLeft size={16} /> Quay lại danh sách
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
