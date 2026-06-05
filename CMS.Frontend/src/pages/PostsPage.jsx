import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container section-padding">
      <h1 className="section-title">Tin Tức & Sự Kiện</h1>
      
      <div className="post-grid">
        {posts.map(post => (
          <div key={post.id} className="glass-card post-card animate-fade-in">
            {post.imageUrl ? (
              <img src={`https://localhost:7296${post.imageUrl}`} alt={post.title} className="post-img"/>
            ) : (
              <div className="post-img-placeholder">Không có ảnh</div>
            )}
            <div className="post-info">
              <span className="category-badge">{post.categoryName}</span>
              <h3>{post.title}</h3>
              <p className="date">{new Date(post.createdAt).toLocaleDateString()}</p>
              <Link to={`/posts/${post.id}`} className="read-more">Đọc tiếp →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostsPage;
