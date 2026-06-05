import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.productId === product.id);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm vào giỏ hàng!');
    window.dispatchEvent(new Event('storage'));
    navigate('/cart');
  };

  if (!product) return <div className="container section-padding text-center">Đang tải...</div>;

  return (
    <div className="container section-padding">
      <div className="glass-card animate-fade-in" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          {product.imageUrl ? (
            <img src={`https://localhost:7296${product.imageUrl}`} alt={product.name} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Không có ảnh
            </div>
          )}
        </div>
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
          <span className="category-badge" style={{ marginBottom: '15px' }}>{product.categoryProduct?.name || 'Sản phẩm'}</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{product.name}</h1>
          <p className="price" style={{ fontSize: '2rem' }}>{product.price.toLocaleString()} đ</p>
          
          <div style={{ margin: '30px 0', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <button style={{ padding: '10px 15px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span style={{ padding: '10px 20px', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>{quantity}</span>
              <button style={{ padding: '10px 15px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            
            <button className="btn-primary" style={{ flex: '1', padding: '15px' }} onClick={addToCart}>
              Thêm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
