import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5188';
const BG_COLORS = ['#f3e8ff', '#fef08a', '#e0e7ff', '#cffafe', '#fee2e2', '#dcfce7', '#ffe4e6', '#f1f5f9'];

/**
 * CategorySection - Section danh mục trang chủ
 */
function CategorySection({ categories = [] }) {
  const getImg = (url) => {
    if (!url) return 'https://cdn-icons-png.flaticon.com/512/3381/3381190.png';
    return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
  };

  return (
    <section style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#222' }}>Danh Mục Sản Phẩm</h2>
        <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--primary, #326e51)', fontWeight: '600', textDecoration: 'none' }}>
          Xem tất cả <ChevronRight size={15} />
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ flexShrink: 0, width: '120px', height: '140px', borderRadius: '12px', backgroundColor: '#f0f0f0', animation: 'pulse 1.5s infinite' }} />
            ))
          : categories.map((cat, idx) => (
              <Link key={cat.id} id={`home-cat-${cat.id}`} to={`/products?category=${cat.id}`}
                style={{ flexShrink: 0, textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{ width: '120px', height: '140px', borderRadius: '12px', backgroundColor: BG_COLORS[idx % BG_COLORS.length], overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.7)', margin: '6px 6px 0', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                    <img src={getImg(cat.imageUrl)} alt={cat.name}
                      style={{ maxWidth: '100%', maxHeight: '70px', objectFit: 'contain' }}
                      onError={e => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3381/3381190.png'; }}
                    />
                  </div>
                  <div style={{ padding: '8px 6px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.name}
                  </div>
                </div>
              </Link>
            ))
        }
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </section>
  );
}

export default CategorySection;
