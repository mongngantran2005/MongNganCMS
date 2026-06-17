import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowRight } from 'lucide-react';

/**
 * Promotion - Banner khuyến mãi nổi bật trang chủ
 */
function Promotion() {
  const promos = [
    {
      id: 1,
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '🎁',
      title: 'Giảm 20% cho đơn đầu tiên',
      desc: 'Áp dụng cho khách hàng mới đăng ký tài khoản',
      code: 'NEWBIE20',
      link: '/products',
    },
    {
      id: 2,
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '🚚',
      title: 'Miễn phí vận chuyển',
      desc: 'Cho mọi đơn hàng từ 99.000₫ trở lên',
      code: 'FREESHIP',
      link: '/products',
    },
    {
      id: 3,
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: '⭐',
      title: 'Tích điểm đổi quà',
      desc: 'Mua hàng tích điểm, đổi ngay voucher hấp dẫn',
      code: 'LOYALTY',
      link: '/products',
    },
  ];

  return (
    <section style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Tag size={20} color="var(--primary, #326e51)" />
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#222', margin: 0 }}>Ưu Đãi Đặc Biệt</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {promos.map(promo => (
          <Link key={promo.id} to={promo.link} id={`promo-${promo.id}`} style={{ textDecoration: 'none' }}>
            <div
              style={{ background: promo.bg, borderRadius: '12px', padding: '22px', color: '#fff', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{promo.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '6px' }}>{promo.title}</h3>
              <p style={{ fontSize: '13px', opacity: 0.88, marginBottom: '14px', lineHeight: '1.5' }}>{promo.desc}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', border: '1px dashed rgba(255,255,255,0.7)' }}>
                  {promo.code}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}>
                  Mua ngay <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Promotion;
