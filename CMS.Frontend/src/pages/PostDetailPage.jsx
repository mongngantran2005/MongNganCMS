import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!post) return <div className="container section-padding text-center">Đang tải...</div>;

  return (
    <div className="container section-padding" style={{ maxWidth: '800px' }}>
      <Link to="/posts" style={{ color: 'var(--primary)', marginBottom: '20px', display: 'inline-block' }}>← Quay lại danh sách</Link>
      <div className="glass-card animate-fade-in" style={{ padding: '40px' }}>
        <span className="category-badge" style={{ marginBottom: '15px' }}>{post.category?.name || 'Tin tức'}</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{post.title}</h1>
        <p className="date" style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</p>
        
        {post.imageUrl && (
          <div style={{ marginBottom: '30px' }}>
            <img src={`https://localhost:7296${post.imageUrl}`} alt={post.title} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '400px' }} />
          </div>
        )}

        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#e2e8f0' }} dangerouslySetInnerHTML={{ __html: post.content }}>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
