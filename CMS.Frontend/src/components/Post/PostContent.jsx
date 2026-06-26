import React from 'react';

const BACKEND_URL = import.meta.env.VITE_API_URL;
function getImg(url) {
  if (!url) return null;
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

/**
 * PostContent - Hiển thị nội dung chi tiết bài viết
 */
function PostContent({ post }) {
  if (!post) return null;

  const formatDate = (str) => {
    if (!str) return '';
    return new Date(str).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <article style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', maxWidth: '820px', margin: '0 auto' }}>
      {/* Category tag */}
      {post.categoryName && (
        <span style={{
          display: 'inline-block', backgroundColor: '#f0faf5',
          color: 'var(--primary, #326e51)', fontSize: '12px', fontWeight: '700',
          padding: '4px 12px', borderRadius: '20px', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          {post.categoryName}
        </span>
      )}

      {/* Title */}
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', lineHeight: '1.4', marginBottom: '14px' }}>
        {post.title}
      </h1>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#999', fontSize: '13px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f0f0f0' }}>
        <span>📅 {formatDate(post.createdAt)}</span>
        {post.author && <span>✍️ {post.author}</span>}
      </div>

      {/* Featured image */}
      {post.imageUrl && (
        <div style={{ marginBottom: '28px', borderRadius: '8px', overflow: 'hidden', maxHeight: '420px' }}>
          <img
            src={getImg(post.imageUrl)}
            alt={post.title}
            style={{ width: '100%', height: '420px', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Body content */}
      <div
        style={{ fontSize: '16px', lineHeight: '1.85', color: '#444' }}
        dangerouslySetInnerHTML={{ __html: post.content || post.description || '<p>Không có nội dung.</p>' }}
      />
    </article>
  );
}

export default PostContent;
