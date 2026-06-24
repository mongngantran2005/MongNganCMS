import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, MapPin } from 'lucide-react';
import '../App.css';

function Navbar() {
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState(() =>
    JSON.parse(localStorage.getItem('customerInfo'))
  );
  const [cartCount, setCartCount] = useState(0);
  const [searchText, setSearchText] = useState('');

  const getCartKey = () => {
    try {
      const info = JSON.parse(localStorage.getItem('customerInfo'));
      return info?.id ? `cart_${info.id}` : 'cart';
    } catch { return 'cart'; }
  };

  const refreshCart = () => {
    const cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
    setCartCount(cart.reduce((t, i) => t + i.quantity, 0));
  };

  useEffect(() => {
    refreshCart();
    const handler = () => {
      refreshCart();
      setCustomerInfo(JSON.parse(localStorage.getItem('customerInfo')));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('customerInfo');
    setCustomerInfo(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchText)}`);
    } else {
      navigate(`/products`);
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className="header">
        <div className="container">
          <div className="header-top">
            <Link to="/" className="brand">MongNganCMS</Link>

            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <Search size={20} />
              </button>
            </form>

            <div className="header-actions">
              <div className="action-item">
                <MapPin size={22} />
                <span>150 Chi Nhánh</span>
              </div>

              {customerInfo ? (
                <div className="action-item user-dropdown-wrapper">
                  {/* Avatar or User icon */}
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {customerInfo.avatarUrl ? (
                      <img
                        src={customerInfo.avatarUrl.startsWith('http') ? customerInfo.avatarUrl : `http://localhost:5188${customerInfo.avatarUrl}`}
                        alt="avatar"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <span>{customerInfo.fullName?.split(' ').pop()}</span>
                  
                  {/* Dropdown Menu */}
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      {/* Mini avatar in dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {customerInfo.avatarUrl ? (
                            <img
                              src={customerInfo.avatarUrl.startsWith('http') ? customerInfo.avatarUrl : `http://localhost:5188${customerInfo.avatarUrl}`}
                              alt="avatar"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <User size={22} color="#999" />
                          )}
                        </div>
                        <div>
                          <strong>{customerInfo.fullName}</strong>
                          <small style={{ display: 'block' }}>{customerInfo.email || 'Thành viên'}</small>
                        </div>
                      </div>
                    </div>
                    <ul className="user-dropdown-list">
                      <li><Link to="/profile">Thông tin cá nhân</Link></li>
                      <li><button onClick={handleLogout}>Đăng xuất</button></li>
                    </ul>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="action-item" style={{ color: 'white' }}>
                  <User size={22} />
                  <span>Đăng nhập</span>
                </Link>
              )}

              <Link to="/cart" className="action-item cart-icon-wrapper" style={{ color: 'white' }}>
                <ShoppingCart size={22} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                <span>Giỏ hàng</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-bottom">
        <div className="container">
          <ul className="nav-list">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/products">Sản phẩm</Link></li>
            <li><Link to="/posts">Tin tức</Link></li>
            {/* <li><Link to="/cart" style={{ color: 'var(--price-color)' }}>🔥 Khuyến mãi</Link></li> */}
            {!customerInfo && <li><Link to="/register">Đăng ký</Link></li>}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
