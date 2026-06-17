import React, { useState, useEffect } from 'react';
import PostList from '../components/Post/PostList';
import Pagination from '../components/Products/Pagination';
import { getPosts } from '../services/postService';

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    getPosts()
      .then(data => {
        setPosts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(posts.length / pageSize);
  const pagedPosts = posts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px' }}>
            Góc Làm Đẹp
          </h1>
          <p style={{ fontSize: '15px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Cập nhật những xu hướng làm đẹp mới nhất, bí quyết chăm sóc da và review sản phẩm chân thực từ chuyên gia.
          </p>
        </div>

        <PostList posts={pagedPosts} loading={loading} />
        
        {totalPages > 1 && (
          <div style={{ marginTop: '40px' }}>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
        
      </div>
    </div>
  );
}

export default PostsPage;
