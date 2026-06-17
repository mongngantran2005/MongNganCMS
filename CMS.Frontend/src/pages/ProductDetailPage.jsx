import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ProductImage from '../components/ProductDetail/ProductImage';
import ProductInfo from '../components/ProductDetail/ProductInfo';
import QuantitySelector from '../components/ProductDetail/QuantitySelector';
import AddToCartButton from '../components/ProductDetail/AddToCartButton';
import RelatedProducts from '../components/ProductDetail/RelatedProducts';
import { getProductById } from '../services/productService';
import { useCart } from '../hooks/useCart';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    setQuantity(1);
    getProductById(id)
      .then(data => setProduct(data))
      .catch(console.error);
  }, [id]);

  const handleAddToCart = (buyNow = false) => {
    const customerInfo = localStorage.getItem('customerInfo');
    if (!customerInfo) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }
    
    // Add to cart from hook
    addToCart(product, quantity);
    
    if (buyNow) {
      navigate('/cart');
    } else {
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  if (!product) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>Đang tải...</div>;
  }

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh', paddingBottom: '40px' }}>
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

      <div className="container" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          <div style={{ width: '420px', flexShrink: 0 }}>
            <ProductImage imageUrl={product.imageUrl} productName={product.name} />
          </div>

          <div style={{ flex: 1, minWidth: '400px', backgroundColor: '#fff', borderRadius: '10px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <ProductInfo product={product} />
            
            <div style={{ margin: '24px 0' }}>
              <QuantitySelector 
                quantity={quantity} 
                onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                onIncrease={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                max={product.stockQuantity}
                disabled={isOutOfStock}
              />
            </div>

            <AddToCartButton 
              outOfStock={isOutOfStock} 
              onAddToCart={() => handleAddToCart(false)}
              onBuyNow={() => handleAddToCart(true)}
            />
          </div>

          <div style={{ width: '260px', flexShrink: 0 }}>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', textDecoration: 'none', fontSize: '14px', padding: '14px 18px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', fontWeight: '600' }}>
              <ChevronLeft size={18} /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
      </div>
    </div>
  );
}

export default ProductDetailPage;
