import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts')
      .then(res => { setPosts(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const getImg = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:5188${url}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="container section-padding">
      <h1 className="page-title">Tin Tức & Góc Làm Đẹp</h1>

      {loading ? (
        <p className="state-msg">Đang tải tin tức...</p>
      ) : posts.length === 0 ? (
        <p className="state-msg">Chưa có bài viết nào.</p>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              {getImg(post.imageUrl) ? (
                <img src={getImg(post.imageUrl)} alt={post.title} />
              ) : (
                <div className="post-card-img-placeholder">Không có ảnh</div>
              )}
              <div className="post-card-body">
                <div className="post-card-category">{post.categoryName}</div>
                <h3 className="post-card-title">{post.title}</h3>
                <div className="post-card-footer">
                  <span className="post-card-date">🕐 {formatDate(post.createdAt)}</span>
                  <Link to={`/posts/${post.id}`} className="read-more-link">Đọc tiếp →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostsPage;
