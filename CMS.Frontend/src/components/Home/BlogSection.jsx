import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PostCard from '../Post/PostCard';

/**
 * BlogSection - Section tin tức / blog trang chủ
 */
function BlogSection({ posts = [], loading = false }) {
  return (
    <section style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#222', margin: 0 }}>Góc Làm Đẹp – Tin Tức</h2>
        <Link to="/posts" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--primary, #326e51)', fontWeight: '600', textDecoration: 'none' }}>
          Xem tất cả <ChevronRight size={15} />
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: '340px', backgroundColor: '#f0f0f0', borderRadius: '10px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>Chưa có bài viết nào.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </section>
  );
}

export default BlogSection;
