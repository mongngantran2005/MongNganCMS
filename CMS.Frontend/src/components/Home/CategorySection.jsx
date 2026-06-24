import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5188';

// Use lighter pastel colors for the cards
const BG_COLORS = ['#f3f4f6', '#fef9c3', '#e0e7ff', '#cffafe', '#fee2e2', '#dcfce7', '#ffe4e6', '#f1f5f9'];
const BORDER_COLORS = ['#e5e7eb', '#fde047', '#a5b4fc', '#67e8f9', '#fca5a5', '#86efac', '#fda4af', '#cbd5e1'];

/**
 * CategorySection - Section danh mục trang chủ
 */
function CategorySection({ categories = [] }) {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (categories.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 122, behavior: 'smooth' }); // 110px width + 12px gap
        }
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [categories, isHovered]);

  const getImg = (url) => {
    if (!url) return 'https://cdn-icons-png.flaticon.com/512/3381/3381190.png';
    return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
  };

  return (
    <section style={{ marginBottom: '32px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#306E51', textTransform: 'uppercase' }}>Danh Mục</h2>
      </div>

      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
      >
        {categories.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ flexShrink: 0, width: '110px', height: '140px', borderRadius: '8px', backgroundColor: '#f0f0f0', animation: 'pulse 1.5s infinite' }} />
            ))
          : categories.map((cat, idx) => {
              const bgColor = BG_COLORS[idx % BG_COLORS.length];
              const borderColor = BORDER_COLORS[idx % BORDER_COLORS.length];

              return (
                <Link key={cat.id} id={`home-cat-${cat.id}`} to={`/products?category=${cat.id}`}
                  style={{ flexShrink: 0, textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ 
                    display: 'flex', flexDirection: 'column', 
                    width: '110px', height: '140px',
                    borderRadius: '8px', 
                    border: `1px solid ${borderColor}`,
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Image Area */}
                    <div style={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: '4px' }}>
                      <img src={getImg(cat.imageUrl)} alt={cat.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        onError={e => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3381/3381190.png'; }}
                      />
                    </div>
                    {/* Text Area */}
                    <div style={{ 
                      flex: 1, 
                      backgroundColor: bgColor, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      padding: '0 6px'
                    }}>
                      <div style={{ 
                        fontSize: '12px', fontWeight: '500', color: '#333', 
                        textAlign: 'center', 
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>
                        {cat.name}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
        }
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </section>
  );
}

export default CategorySection;
