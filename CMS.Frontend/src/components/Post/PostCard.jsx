import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=400';

function getImg(url) {
  if (!url) return FALLBACK_IMG;
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

/**
 * PostCard - Thẻ bài viết hiển thị trong lưới
 */
function PostCard({ post }) {
  return (
    <div
      id={`post-card-${post.id}`}
      style={{
        backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)', transition: 'box-shadow 0.2s, transform 0.2s',
        display: 'flex', flexDirection: 'column'
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.13)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'none'; }}
    >
      <Link to={`/posts/${post.id}`} style={{ display: 'block', overflow: 'hidden', height: '200px' }}>
        <img
          src={getImg(post.imageUrl)}
          alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
          onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
          onError={e => { e.target.src = FALLBACK_IMG; }}
        />
      </Link>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {post.categoryName && (
          <span style={{ fontSize: '11px', color: 'var(--primary, #326e51)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {post.categoryName}
          </span>
        )}

        <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '15px', fontWeight: '600', color: '#222', lineHeight: '1.5',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            margin: 0, transition: 'color 0.2s'
          }}
            onMouseEnter={e => { e.target.style.color = 'var(--primary, #326e51)'; }}
            onMouseLeave={e => { e.target.style.color = '#222'; }}
          >
            {post.title}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#999', fontSize: '12px', marginTop: 'auto' }}>
          <Clock size={12} />
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <Link
          to={`/posts/${post.id}`}
          style={{ color: 'var(--primary, #326e51)', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}
        >
          Đọc tiếp →
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
