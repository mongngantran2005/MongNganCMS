import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

/**
 * Common/Footer.jsx - Footer đầy đủ theo cây thư mục mới
 */
function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a2e', color: '#ccc', marginTop: '48px' }}>
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px' }}>

          {/* Brand */}
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '14px' }}>MongNganCMS</h3>
            <p style={{ fontSize: '13px', lineHeight: '1.75', color: '#aaa', marginBottom: '16px' }}>
              Hệ thống bán lẻ mỹ phẩm chính hãng hàng đầu Việt Nam. Trải nghiệm mua sắm tuyệt vời với hơn 150 chi nhánh toàn quốc.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: 'f', label: 'Facebook', bg: '#1877F2' },
                { icon: 'ig', label: 'Instagram', bg: '#E4405F' },
                { icon: 'yt', label: 'Youtube', bg: '#FF0000' },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', textDecoration: 'none', transition: 'all 0.2s', fontSize: '13px', fontWeight: '800' }}
                  onMouseEnter={e => { e.currentTarget.style.background = s.bg; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#ccc'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Hỗ Trợ Khách Hàng</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Hotline: 1800 6324', 'Câu hỏi thường gặp', 'Hướng dẫn đặt hàng', 'Phương thức vận chuyển', 'Chính sách đổi trả'].map(item => (
                <li key={item}><a href="#" style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.target.style.color = 'var(--primary, #326e51)'; }}
                  onMouseLeave={e => { e.target.style.color = '#aaa'; }}
                >{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Về chúng tôi */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Về MongNganCMS</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Giới thiệu', 'Tuyển dụng', 'Chính sách bảo mật', 'Điều khoản sử dụng'].map(item => (
                <li key={item}><a href="#" style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.target.style.color = 'var(--primary, #326e51)'; }}
                  onMouseLeave={e => { e.target.style.color = '#aaa'; }}
                >{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Liên hệ + Newsletter */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Liên Hệ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '13px', color: '#aaa' }}>
                <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} /> 123 Nguyễn Huệ, Q.1, TP.HCM
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#aaa' }}>
                <Phone size={14} /> 1800 6324
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#aaa' }}>
                <Mail size={14} /> contact@mongngan.vn
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>Đăng ký nhận ưu đãi mới nhất:</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input id="footer-email-input" type="email" placeholder="Email của bạn" style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: 'none', outline: 'none', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <button id="footer-subscribe-btn" style={{ padding: '8px 14px', backgroundColor: 'var(--primary, #326e51)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: 'inherit' }}>Gửi</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
            © 2026 MongNganCMS. Trải nghiệm E-commerce kết hợp CMS bằng ASP.NET Core API.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Chính sách', 'Điều khoản', 'Cookie'].map(item => (
              <a key={item} href="#" style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
