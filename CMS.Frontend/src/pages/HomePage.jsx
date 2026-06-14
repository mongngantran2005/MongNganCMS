import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400";
const FALLBACK_POST_IMAGE = "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=400";

const BACKEND_URL = "http://localhost:5188";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    // Fetch banners
    api.get('/banners')
      .then(res => setBanners(res.data))
      .catch(error => console.error("Error fetching banners:", error));

    api.get('/products')
      .then(res => {
        // Lấy 10 sản phẩm mới nhất (sắp xếp ID giảm dần)
        const latestProducts = res.data.sort((a, b) => b.id - a.id).slice(0, 10);
        setProducts(latestProducts);
        setLoadingProducts(false);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setLoadingProducts(false);
      });

    api.get('/posts')
      .then(res => {
        // Lấy 3 bài mới nhất (sắp xếp ID giảm dần)
        const latestPosts = res.data.sort((a, b) => b.id - a.id).slice(0, 3);
        setPosts(latestPosts);
        setLoadingPosts(false);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
        setLoadingPosts(false);
      });

    api.get('/categoryproducts')
      .then(res => {
        setCategories(res.data);
      })
      .catch(error => console.error(error));
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getImageUrl = (url, fallback) => {
    if (!url) return fallback;
    if (url.startsWith('http')) return url;
    return `${BACKEND_URL}${url}`;
  };

  return (
    <main className="main-content container">
      {/* Hero Banner */}
      <div className="hero-banner" style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div key={banner.id} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', position: 'relative' }}>
              {banner.targetUrl ? (
                <a href={banner.targetUrl}>
                  <img
                    src={getImageUrl(banner.imageUrl, "https://via.placeholder.com/1200x350")}
                    alt={banner.title}
                    style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                  />
                </a>
              ) : (
                <img
                  src={getImageUrl(banner.imageUrl, "https://via.placeholder.com/1200x350")}
                  alt={banner.title}
                  style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                />
              )}
            </div>
          ))
        ) : (
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200"
            alt="Khuyến mãi mặc định"
            style={{ width: '100%', height: '350px', objectFit: 'cover' }}
          />
        )}
      </div>

      {/* Categories Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Danh Mục Sản Phẩm</h2>
          <Link to="/products" className="view-more">Xem tất cả <ChevronRight size={16} /></Link>
        </div>
        <div className="category-scroll" style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '10px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {categories.map((cat, index) => {
            // Danh sách các màu viền pastel nhẹ nhàng
            const bgColors = ['#f3e8ff', '#fef08a', '#e0e7ff', '#cffafe', '#fee2e2', '#dcfce7', '#ffe4e6', '#f1f5f9'];
            const bgColor = bgColors[index % bgColors.length];
            
            return (
              <Link key={cat.id} to={`/products?category=${cat.id}`} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
                 <div style={{ width: '130px', height: '150px', borderRadius: '12px', backgroundColor: bgColor, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s' }}>
                    <div style={{ flex: 1, backgroundColor: '#fff', margin: '4px 4px 0 4px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={getImageUrl(cat.imageUrl, 'https://cdn-icons-png.flaticon.com/512/3381/3381190.png')} 
                        alt={cat.name} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                      />
                    </div>
                    <div style={{ padding: '8px 4px', textAlign: 'center', fontSize: '12px', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.name}
                    </div>
                 </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Flash Sale / Featured Products */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            Sản Phẩm Mới Nhất
          </h2>
          <Link to="/products" className="view-more">Xem tất cả <ChevronRight size={16} /></Link>
        </div>

        {loadingProducts ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Đang tải danh sách sản phẩm...</p>
        ) : products.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Chưa có sản phẩm nào trong hệ thống.</p>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="product-card"
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
              >
                {/* Nhãn giả giảm giá */}
                <span className="discount-badge">-10%</span>

                <div className="product-img-wrapper">
                  <img
                    src={getImageUrl(product.imageUrl, FALLBACK_PRODUCT_IMAGE)}
                    alt={product.name}
                    className="product-img"
                  />
                </div>
                <div className="product-info" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div className="product-brand">{product.categoryName}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price-row" style={{ marginTop: 'auto' }}>
                    <span className="product-price">{formatPrice(product.price)}</span>
                    <span className="product-old-price">{formatPrice(product.price * 1.1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* News Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Góc Làm Đẹp - Tin Tức</h2>
          <Link to="/posts" className="view-more">Xem tất cả <ChevronRight size={16} /></Link>
        </div>

        {loadingPosts ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Đang tải danh sách tin tức...</p>
        ) : posts.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Chưa có bài viết nào trong hệ thống.</p>
        ) : (
          <div className="news-grid">
            {posts.map(post => (
              <div key={post.id} className="news-card">
                <img
                  src={getImageUrl(post.imageUrl, FALLBACK_POST_IMAGE)}
                  alt={post.title}
                  className="news-img"
                />
                <div className="news-content">
                  <h3 className="news-title">{post.title}</h3>
                  <p className="news-desc">Danh mục: {post.categoryName}</p>
                  <span className="news-date">
                    <Clock size={12} /> {formatDate(post.createdAt)}
                  </span>
                  <Link to={`/posts/${post.id}`} className="read-more" style={{ display: 'inline-block', marginTop: '10px', color: 'var(--primary)', fontWeight: 'bold' }}>Đọc tiếp →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;
