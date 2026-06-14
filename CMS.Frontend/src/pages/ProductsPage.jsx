import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') ? parseInt(searchParams.get('category')) : 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categoryproducts')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory === 'all' ? '/products' : `/products/category/${selectedCategory}`;
    api.get(url)
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [selectedCategory]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getImg = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:5188${url}`;
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchKeyword.toLowerCase()) || 
    (p.categoryName && p.categoryName.toLowerCase().includes(searchKeyword.toLowerCase()))
  );

  return (
    <div className="container section-padding" style={{ backgroundColor: '#f5f5f5', padding: '20px 0' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar (Categories) - Style Hasaki */}
        <div className="products-sidebar" style={{ width: '250px', flexShrink: 0, backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>☰</span> DANH MỤC
          </h3>
          
          <ul className="category-sidebar-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {/* "Tất cả" option */}
            <li style={{ marginBottom: '5px' }}>
              <div 
                onClick={() => setSelectedCategory('all')}
                style={{ 
                  cursor: 'pointer', 
                  fontWeight: selectedCategory === 'all' ? '600' : '400', 
                  color: selectedCategory === 'all' ? 'var(--primary)' : '#333', 
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px',
                  backgroundColor: selectedCategory === 'all' ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                  borderRadius: '4px',
                  transition: 'all 0.2s'
                }}
              >
                <span>Tất cả sản phẩm</span>
              </div>
            </li>
            
            {/* Parent Categories */}
            {categories.filter(c => !c.parentId).map(cat => {
              const childCats = categories.filter(c => c.parentId === cat.id);
              const isActiveParent = selectedCategory === cat.id || childCats.some(c => c.id === selectedCategory);
              
              return (
                <li key={cat.id} style={{ marginBottom: '5px' }}>
                  <div 
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{ 
                      cursor: 'pointer', 
                      fontWeight: isActiveParent ? '600' : '400', 
                      color: isActiveParent ? 'var(--primary)' : '#333',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 10px',
                      backgroundColor: isActiveParent ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                      borderRadius: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {cat.imageUrl && <img src={getImg(cat.imageUrl)} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} alt={cat.name} />}
                    <span style={{ flex: 1 }}>{cat.name}</span>
                    {childCats.length > 0 && (
                      <span style={{ fontSize: '0.8rem', color: '#999' }}>{isActiveParent ? '▼' : '▶'}</span>
                    )}
                  </div>
                  
                  {/* Child Categories */}
                  {isActiveParent && childCats.length > 0 && (
                    <ul style={{ listStyle: 'none', paddingLeft: '44px', marginTop: '5px', marginBottom: '10px' }}>
                      {childCats.map(child => (
                        <li key={child.id} style={{ marginBottom: '2px' }}>
                          <div
                            onClick={(e) => { e.stopPropagation(); setSelectedCategory(child.id); }}
                            style={{ 
                              cursor: 'pointer', 
                              fontSize: '0.9rem',
                              color: selectedCategory === child.id ? 'var(--primary)' : '#555',
                              fontWeight: selectedCategory === child.id ? '600' : '400',
                              padding: '5px 0',
                              transition: 'all 0.2s'
                            }}
                          >
                            {child.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Content (Products) */}
        <div className="products-content" style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h1 className="page-title" style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.4rem', borderBottom: '1px solid #eee', paddingBottom: '15px', color: '#333' }}>
            {searchKeyword ? `Kết quả tìm kiếm cho: "${searchKeyword}"` : (
               selectedCategory === 'all' 
                 ? 'Tất Cả Sản Phẩm' 
                 : (categories.find(c => c.id === selectedCategory)?.name || 'Sản Phẩm')
            )}
          </h1>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Đang tải sản phẩm...</div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Không tìm thấy sản phẩm nào phù hợp.</div>
          ) : (
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {filteredProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="product-card" style={{ border: '1px solid #eee', borderRadius: '4px', padding: '10px', boxShadow: 'none', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', height: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <span className="discount-badge" style={{ top: '10px', left: '10px' }}>-10%</span>
                    <div className="product-img-wrapper" style={{ height: '200px', marginBottom: '10px' }}>
                      {getImg(product.imageUrl) ? (
                        <img src={getImg(product.imageUrl)} alt={product.name} className="product-img" style={{ objectFit: 'contain' }} />
                      ) : (
                        <div className="product-img" style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'#ccc', fontSize:'13px', background: '#f9f9f9', height: '100%' }}>Không có ảnh</div>
                      )}
                    </div>
                    <div className="product-info" style={{ padding: '0' }}>
                      <div className="product-brand" style={{ fontSize: '0.8rem', color: '#999', marginBottom: '5px' }}>{product.categoryName}</div>
                      <h3 className="product-name" style={{ fontSize: '0.95rem', height: '40px', overflow: 'hidden', color: '#333', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</h3>
                      <div className="product-price-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                        <span className="product-price" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{formatPrice(product.price)}</span>
                        <span className="product-old-price" style={{ fontSize: '0.85rem' }}>{formatPrice(product.price * 1.1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
