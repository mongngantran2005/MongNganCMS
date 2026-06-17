import React from 'react';
import PostCard from './PostCard';
import Loading from '../Common/Loading';

/**
 * PostList - Lưới hiển thị danh sách bài viết
 */
function PostList({ posts, loading }) {
  if (loading) return <Loading text="Đang tải bài viết..." />;

  if (!posts || posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
        <p style={{ fontSize: '15px' }}>Chưa có bài viết nào.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
    }}>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList;
