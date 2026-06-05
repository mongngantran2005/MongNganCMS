import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    api.get('/categoryproducts')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      api.get('/products')
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    } else {
      api.get(`/products/category/${selectedCategory}`)
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedCategory]);

  return (
    <div className="container section-padding">
      <h1 className="section-title">Tất Cả Sản Phẩm</h1>
      
      <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
        <button 
          className={selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}
          onClick={() => setSelectedCategory('all')}
        >
          Tất cả
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            className={selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

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
              <span className="category-badge">{product.categoryName || 'Sản phẩm'}</span>
              <h3>{product.name}</h3>
              <p className="price">{product.price.toLocaleString()} đ</p>
              <Link to={`/products/${product.id}`} className="btn-outline w-100 text-center">Xem chi tiết</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
