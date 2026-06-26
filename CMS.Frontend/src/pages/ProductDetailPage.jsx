import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Truck, Shield, RotateCcw, Gift, ChevronRight, Minus, Plus, ShoppingCart, Zap, ZoomIn, Heart, Share2 } from 'lucide-react';
import RelatedProducts from '../components/ProductDetail/RelatedProducts';
import { getProductById } from '../services/productService';
import { useCart } from '../hooks/useCart';

const BACKEND_URL = 'http://localhost:5188';
const getImg = (url) => {
  if (!url) return 'https://placehold.co/500x500/f5f5f5/999?text=No+Image';
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
};
const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getProductById(id)
      .then(data => setProduct(data))
      .catch(console.error);
  }, [id]);

  const handleAddToCart = (buyNow = false) => {
    if (quantity > product.stockQuantity) {
      alert('Số lượng sản phẩm trong kho không đủ!');
      return;
    }
    const customerInfo = localStorage.getItem('customerInfo');
    if (!customerInfo) {
      if (window.confirm('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng. Đăng nhập ngay?')) {
        navigate('/login');
      }
      return;
    }
    addToCart(product, quantity);
    if (buyNow) {
      navigate('/cart');
    } else {
      // Toast-like notification without alert
      const toast = document.createElement('div');
      toast.textContent = '✓ Đã thêm vào giỏ hàng!';
      toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#326e51;color:#fff;padding:14px 20px;border-radius:8px;z-index:9999;font-size:14px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.2);animation:fadeIn 0.3s ease';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 2500);
    }
  };

  if (!product) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTop: '3px solid #326e51', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#888', fontSize: '14px' }}>Đang tải sản phẩm...</span>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const originalPrice = Math.round(product.price * 1.15 / 1000) * 1000;
  const discountPct = Math.round((1 - product.price / originalPrice) * 100);

  const POLICIES = [
    { icon: <Shield size={22} color="#326e51" />, title: 'Hàng chính hãng 100%', sub: 'Hoàn tiền nếu hàng giả' },
    { icon: <Truck size={22} color="#326e51" />, title: 'Giao hàng nhanh', sub: 'Trong ngày tại nội thành' },
    { icon: <RotateCcw size={22} color="#326e51" />, title: 'Đổi trả miễn phí', sub: 'Trong vòng 30 ngày' },
    { icon: <Gift size={22} color="#326e51" />, title: 'Quà tặng hấp dẫn', sub: 'Cho đơn hàng từ 299k' },
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { color: #326e51 !important; }
        .qty-btn:hover { background: #f0faf5 !important; }
        .cart-btn:hover { background: #f0faf5 !important; border-color: #326e51 !important; }
        .buy-btn:hover { background: #245239 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(50,110,81,0.4) !important; }

        /* ── CSS cho nội dung HTML từ CKEditor ── */
        .ck-content-display { font-size: 15px; color: #444; line-height: 1.9; }
        .ck-content-display h1,.ck-content-display h2,.ck-content-display h3,.ck-content-display h4 { color: #1a1a1a; font-weight: 700; margin: 1.2em 0 0.5em; line-height: 1.4; }
        .ck-content-display h2 { font-size: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 6px; }
        .ck-content-display h3 { font-size: 17px; color: #326e51; }
        .ck-content-display p { margin: 0 0 1em; }
        .ck-content-display strong { color: #1a1a1a; font-weight: 700; }
        .ck-content-display em { font-style: italic; }
        .ck-content-display ul,.ck-content-display ol { padding-left: 1.5em; margin: 0.5em 0 1em; }
        .ck-content-display li { margin-bottom: 0.4em; }
        .ck-content-display blockquote { border-left: 4px solid #326e51; margin: 1em 0; padding: 12px 16px; background: #f0faf5; color: #555; font-style: italic; border-radius: 0 6px 6px 0; }
        .ck-content-display img { max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; display: block; }
        .ck-content-display figure.image { margin: 16px auto; text-align: center; }
        .ck-content-display figure.image img { margin: 0 auto; }
        .ck-content-display figure.image.image-style-side { float: right; margin: 0 0 16px 24px; max-width: 40%; }
        .ck-content-display figure.image.image-style-inline { display: inline-block; margin: 4px 8px; }
        .ck-content-display figcaption { font-size: 13px; color: #888; text-align: center; margin-top: 6px; }
        .ck-content-display table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 14px; }
        .ck-content-display th,.ck-content-display td { border: 1px solid #e0e0e0; padding: 10px 14px; }
        .ck-content-display th { background: #f8faf9; font-weight: 700; color: #333; }
        .ck-content-display tr:nth-child(even) td { background: #fafafa; }
        .ck-content-display a { color: #326e51; text-decoration: underline; }
        .ck-content-display a:hover { color: #245239; }
        .ck-content-display hr { border: none; border-top: 2px solid #f0f0f0; margin: 1.5em 0; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee', padding: '12px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#888' }}>
            <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
            <ChevronRight size={12} />
            <Link to="/products" style={{ color: '#888', textDecoration: 'none' }}>Sản phẩm</Link>
            <ChevronRight size={12} />
            {product.categoryName && (
              <>
                <Link to={`/products?categoryId=${product.categoryId}`} style={{ color: '#888', textDecoration: 'none' }}>{product.categoryName}</Link>
                <ChevronRight size={12} />
              </>
            )}
            <span style={{ color: '#333', fontWeight: '500' }}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main product section */}
      <div className="container" style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ====== LEFT: Image ====== */}
          <div style={{ width: '400px', flexShrink: 0, position: 'sticky', top: '80px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fafafa', aspectRatio: '1' }}>
                <img
                  src={getImg(product.imageUrl)}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease', cursor: 'zoom-in' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  onClick={() => setZoom(true)}
                  onError={e => { e.target.src = 'https://placehold.co/400x400'; }}
                />
                {isOutOfStock && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: '800', fontSize: '18px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '8px 20px', borderRadius: '30px' }}>Hết hàng</span>
                  </div>
                )}
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => setZoom(true)} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                    <ZoomIn size={16} color="#555" />
                  </button>
                  <button onClick={() => setLiked(!liked)} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                    <Heart size={16} fill={liked ? '#e30019' : 'none'} color={liked ? '#e30019' : '#555'} />
                  </button>
                </div>
                {discountPct > 0 && (
                  <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#e30019', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px' }}>
                    -{discountPct}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ====== RIGHT: Info ====== */}
          <div style={{ flex: 1, minWidth: '340px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginBottom: '16px' }}>

              {/* Category tag */}
              <div style={{ marginBottom: '10px' }}>
                <Link to={`/products?categoryId=${product.categoryId}`} style={{ display: 'inline-block', backgroundColor: '#f0faf5', color: '#326e51', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '30px', textDecoration: 'none', border: '1px solid #c8e8d8' }}>
                  {product.categoryName}
                </Link>
              </div>

              {/* Product name */}
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', lineHeight: '1.5', marginBottom: '14px' }}>
                {product.name}
              </h1>

              {/* Rating + SKU */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill={s <= 5 ? '#f5a623' : '#ddd'} stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: '13px', color: '#888', borderLeft: '1px solid #ddd', paddingLeft: '10px' }}>Mã SP: {String(product.id).padStart(8, '0')}</span>
                <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#888', fontSize: '13px' }}>
                  <Share2 size={14} /> Chia sẻ
                </button>
              </div>

              {/* Price */}
              <div style={{ backgroundColor: '#fff8f8', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', border: '1px solid #fde8e8' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '32px', fontWeight: '800', color: '#e30019', letterSpacing: '-1px' }}>{formatPrice(product.price)}</span>
                  <span style={{ fontSize: '16px', color: '#bbb', textDecoration: 'line-through' }}>{formatPrice(originalPrice)}</span>
                  <span style={{ backgroundColor: '#e30019', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px' }}>-{discountPct}%</span>
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Đã bao gồm VAT · Giá tốt nhất thị trường</div>
              </div>

              {/* Stock + Sold */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#888' }}>Tình trạng:</span>
                  {!isOutOfStock ? (
                    <span style={{ color: '#16a34a', fontWeight: '600' }}>● Còn hàng</span>
                  ) : (
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>● Hết hàng</span>
                  )}
                </div>
                {!isOutOfStock && (
                  <div style={{ color: '#888' }}>
                    Kho: <span style={{ color: '#333', fontWeight: '600' }}>{product.stockQuantity}</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '14px', color: '#555', fontWeight: '600', minWidth: '60px' }}>Số lượng:</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                    <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: '36px', height: '36px', border: 'none', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                      <Minus size={14} />
                    </button>
                    <span style={{ width: '44px', textAlign: 'center', fontSize: '15px', fontWeight: '700', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', lineHeight: '36px' }}>
                      {quantity}
                    </span>
                    <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))} style={{ width: '36px', height: '36px', border: 'none', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <span style={{ fontSize: '13px', color: '#bbb' }}>({product.stockQuantity} sản phẩm có sẵn)</span>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button
                  className="cart-btn"
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(false)}
                  style={{ flex: 1, height: '48px', border: '2px solid #326e51', color: '#326e51', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: isOutOfStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isOutOfStock ? 0.5 : 1, transition: 'all 0.2s' }}
                >
                  <ShoppingCart size={18} />
                  THÊM VÀO GIỎ
                </button>
                <button
                  className="buy-btn"
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(true)}
                  style={{ flex: 1, height: '48px', border: 'none', color: '#fff', backgroundColor: '#326e51', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: isOutOfStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isOutOfStock ? 0.5 : 1, transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(50,110,81,0.3)' }}
                >
                  <Zap size={18} />
                  MUA NGAY
                </button>
              </div>

              {/* Policies */}
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {POLICIES.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ flexShrink: 0, marginTop: '2px' }}>{p.icon}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{p.title}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ====== TABS ====== */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
              {/* Tab headers */}
              <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0' }}>
                {[
                  { key: 'description', label: 'Mô tả sản phẩm' },
                  { key: 'details', label: 'Thông tin chi tiết' },
                  { key: 'reviews', label: 'Đánh giá khách hàng' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    className="tab-btn"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      flex: 1, padding: '14px 12px', border: 'none', backgroundColor: 'transparent',
                      fontSize: '14px', fontWeight: activeTab === tab.key ? '700' : '500',
                      color: activeTab === tab.key ? '#326e51' : '#666',
                      borderBottom: activeTab === tab.key ? '3px solid #326e51' : '3px solid transparent',
                      marginBottom: '-2px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div style={{ padding: '28px' }}>
                {activeTab === 'description' && (
                  <div>
                    {product.description ? (
                      <div
                        className="ck-content-display"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    ) : (
                      <div style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                        Sản phẩm này chưa có mô tả.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'details' && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <tbody>
                      {[
                        ['Mã sản phẩm', String(product.id).padStart(8, '0')],
                        ['Tên sản phẩm', product.name],
                        ['Danh mục', product.categoryName],
                        ['Giá bán', formatPrice(product.price)],
                        ['Tình trạng', product.stockQuantity > 0 ? `Còn hàng (${product.stockQuantity})` : 'Hết hàng'],
                      ].map(([label, val], i) => (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                          <td style={{ padding: '12px 16px', color: '#666', fontWeight: '600', width: '180px', borderBottom: '1px solid #f0f0f0' }}>{label}</td>
                          <td style={{ padding: '12px 16px', color: '#333', borderBottom: '1px solid #f0f0f0' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', padding: '20px', backgroundColor: '#fafafa', borderRadius: '10px', marginBottom: '20px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', fontWeight: '800', color: '#f5a623', lineHeight: 1 }}>5.0</div>
                        <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', margin: '8px 0' }}>
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#f5a623" stroke="none">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>Trên 5</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[5,4,3,2,1].map(star => (
                          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', color: '#888', width: '12px' }}>{star}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#f5a623" stroke="none">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <div style={{ flex: 1, height: '6px', backgroundColor: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', backgroundColor: '#f5a623', width: star === 5 ? '100%' : '0%', borderRadius: '3px' }} />
                            </div>
                            <span style={{ fontSize: '12px', color: '#888', width: '20px' }}>{star === 5 ? 1 : 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '14px' }}>
                      Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        <div style={{ marginTop: '32px' }}>
          <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
        </div>
      </div>

      {/* Lightbox */}
      {zoom && (
        <div onClick={() => setZoom(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <img src={getImg(product.imageUrl)} alt={product.name} style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '10px' }} />
        </div>
      )}

      {/* Bottom sticky bar on mobile */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTop: '1px solid #eee', padding: '12px 20px', display: 'none', gap: '12px', zIndex: 100 }}>
        <button onClick={() => handleAddToCart(false)} style={{ flex: 1, height: '44px', border: '2px solid #326e51', color: '#326e51', backgroundColor: '#fff', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Thêm vào giỏ</button>
        <button onClick={() => handleAddToCart(true)} style={{ flex: 1, height: '44px', border: 'none', color: '#fff', backgroundColor: '#326e51', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Mua ngay</button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
