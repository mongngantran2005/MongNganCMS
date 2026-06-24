import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5188';
function getImg(url) {
  if (!url) return 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200';
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

/**
 * Banner - Slider banner trang chủ với auto-play
 */
function Banner({ banners = [] }) {
  const [current, setCurrent] = useState(0);

  const fallback = [{
    id: 0,
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200',
    title: 'Mua sắm mỹ phẩm chính hãng',
    targetUrl: '/products',
  }];

  const slides = banners.length > 0 ? banners : fallback;

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent(c => (c + 1) % slides.length);

  return (
    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f0f0f0', height: '360px' }}>
      {/* Slides */}
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {slides.map((banner, i) => (
          <div
            key={banner.id || i}
            style={{
              position: 'absolute', inset: 0,
              opacity: i === current ? 1 : 0,
              transition: 'opacity 0.6s ease',
              pointerEvents: i === current ? 'auto' : 'none',
              overflow: 'hidden',
              backgroundColor: '#000'
            }}
          >
            {/* Blurred Background */}
            <div style={{
              position: 'absolute', inset: -40,
              backgroundImage: `url(${getImg(banner.imageUrl)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px)',
              opacity: 0.6,
              zIndex: 0
            }} />

            {/* Foreground Image */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              {banner.targetUrl ? (
                <a href={banner.targetUrl} style={{ display: 'block', width: '100%', height: '100%' }}>
                  <img src={getImg(banner.imageUrl)} alt={banner.title || `Banner ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={e => { e.target.src = fallback[0].imageUrl; }}
                  />
                </a>
              ) : (
                <img src={getImg(banner.imageUrl)} alt={banner.title || `Banner ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={e => { e.target.src = fallback[0].imageUrl; }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button id="banner-prev" onClick={prev} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 2, transition: 'background 0.2s' }}>
            <ChevronLeft size={20} />
          </button>
          <button id="banner-next" onClick={next} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 2 }}>
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 2 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === current ? '#fff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Banner;
