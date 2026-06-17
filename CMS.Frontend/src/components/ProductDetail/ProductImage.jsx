import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5188';
function getImg(url, fallback = 'https://via.placeholder.com/500') {
  if (!url) return fallback;
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

/**
 * ProductImage - Gallery ảnh sản phẩm với thumbnail
 */
function ProductImage({ imageUrl, productName, extraImages = [] }) {
  const allImages = [imageUrl, ...extraImages].filter(Boolean);
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(false);

  const prev = () => setSelected(s => Math.max(0, s - 1));
  const next = () => setSelected(s => Math.min(allImages.length - 1, s + 1));

  return (
    <div style={{ position: 'sticky', top: '90px' }}>
      {/* Main image */}
      <div
        style={{
          backgroundColor: '#fff', borderRadius: '10px', padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '12px',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor: '#fafafa', borderRadius: '8px', overflow: 'hidden' }}>
          <img
            src={getImg(allImages[selected])}
            alt={productName}
            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'opacity 0.2s' }}
            onError={e => { e.target.src = 'https://via.placeholder.com/500'; }}
          />
          {/* Zoom hint */}
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => setZoom(true)}
          >
            <ZoomIn size={14} color="#fff" />
          </div>

          {/* Prev / Next */}
          {allImages.length > 1 && (
            <>
              <button onClick={prev} disabled={selected === 0} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: selected === 0 ? 0.3 : 1 }}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={next} disabled={selected === allImages.length - 1} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: selected === allImages.length - 1 ? 0.3 : 1 }}>
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {allImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              style={{
                width: '64px', height: '64px', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer',
                border: i === selected ? '2px solid var(--primary, #326e51)' : '2px solid transparent',
                backgroundColor: '#fafafa', padding: '4px', transition: 'border 0.2s'
              }}
            >
              <img src={getImg(img)} alt={`thumb-${i}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={e => { e.target.src = 'https://via.placeholder.com/64'; }} />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox zoom */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}
        >
          <img src={getImg(allImages[selected])} alt={productName} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
}

export default ProductImage;
