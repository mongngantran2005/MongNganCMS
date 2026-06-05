import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './HomePage.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch latest products
    api.get('/products')
      .then(res => setProducts(res.data.slice(0, 6)))
      .catch(err => console.error(err));

    // Fetch latest posts
    api.get('/posts')
      .then(res => setPosts(res.data.slice(0, 3)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content animate-fade-in">
          <h1>Định Hình Phong Cách <br/><span className="gradient-text">Thời Trang Của Bạn</span></h1>
          <p>Khám phá bộ sưu tập mới nhất với chất lượng tuyệt hảo và thiết kế đẳng cấp.</p>
          <Link to="/products" className="btn-primary">Mua Sắm Ngay</Link>
        </div>
      </section>

      <section className="container section-padding">
        <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="glass-card product-card animate-fade-in">
              <div className="product-image-wrapper">
                {product.imageUrl ? (
                  <img src={`https://localhost:7296${product.imageUrl}`} alt={product.name} className="product-img"/>
                ) : (
                  <div className="product-img-placeholder">Không có ảnh</div>
                )}
              </div>
              <div className="product-info">
                <span className="category-badge">{product.categoryName}</span>
                <h3>{product.name}</h3>
                <p className="price">{product.price.toLocaleString()} đ</p>
                <Link to={`/products/${product.id}`} className="btn-outline w-100 text-center">Xem chi tiết</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-padding">
        <h2 className="section-title">Tin Tức Mới Nhất</h2>
        <div className="post-grid">
          {posts.map(post => (
            <div key={post.id} className="glass-card post-card animate-fade-in">
              {post.imageUrl ? (
                <img src={`https://localhost:7296${post.imageUrl}`} alt={post.title} className="post-img"/>
              ) : (
                <div className="post-img-placeholder">Không có ảnh</div>
              )}
              <div className="post-info">
                <span className="category-badge">{post.categoryName}</span>
                <h3>{post.title}</h3>
                <p className="date">{new Date(post.createdAt).toLocaleDateString()}</p>
                <Link to={`/posts/${post.id}`} className="read-more">Đọc tiếp →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
