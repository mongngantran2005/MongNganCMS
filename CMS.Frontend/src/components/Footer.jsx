import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4 className="footer-heading">Hỗ Trợ Khách Hàng</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#" style={{ textDecoration: 'none' }}>Hotline: 1800 6324</a></li>
              <li><a href="#" style={{ textDecoration: 'none' }}>Các câu hỏi thường gặp</a></li>
              <li><a href="#" style={{ textDecoration: 'none' }}>Hướng dẫn đặt hàng</a></li>
              <li><a href="#" style={{ textDecoration: 'none' }}>Phương thức vận chuyển</a></li>
              <li><a href="#" style={{ textDecoration: 'none' }}>Chính sách đổi trả</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Về MongNganCMS</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#" style={{ textDecoration: 'none' }}>Giới thiệu MongNganCMS</a></li>
              <li><a href="#" style={{ textDecoration: 'none' }}>Tuyển dụng</a></li>
              <li><a href="#" style={{ textDecoration: 'none' }}>Chính sách bảo mật</a></li>
              <li><a href="#" style={{ textDecoration: 'none' }}>Điều khoản sử dụng</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Hợp Tác & Liên Kết</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#" style={{ textDecoration: 'none' }}>Dành cho doanh nghiệp</a></li>
              <li><a href="#" style={{ textDecoration: 'none' }}>Đăng ký nhà cung cấp</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Cập Nhật Tin Tức</h4>
            <p style={{fontSize: '13px', color: '#ccc', marginBottom: '10px'}}>Đăng ký nhận ưu đãi mới nhất.</p>
            <div style={{display: 'flex', gap: '5px'}}>
              <input type="text" placeholder="Email của bạn" style={{padding: '8px', width: '100%', borderRadius: '4px', border: 'none', outline: 'none'}} />
              <button style={{padding: '8px 15px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Gửi</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 MongNganCMS. Trải nghiệm E-commerce kết hợp CMS bằng ASP.NET Core API.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
