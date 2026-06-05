import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('customerInfo');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛍️ MongNgan
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">Trang chủ</Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-links">Sản phẩm</Link>
          </li>
          <li className="nav-item">
            <Link to="/posts" className="nav-links">Tin tức</Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-links cart-icon">
              🛒 Giỏ hàng
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>
          </li>
          {customerInfo ? (
            <li className="nav-item user-menu">
              <span className="nav-links">👤 {customerInfo.fullName}</span>
              <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links btn-login">Đăng nhập</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
