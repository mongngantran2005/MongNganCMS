import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostContent from '../components/Post/PostContent';
import { getPostById } from '../services/postService';
import { ChevronRight, Home } from 'lucide-react';

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostById(id)
      .then(data => { setPost(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải bài viết...</div>;
  }

  if (!post) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Không tìm thấy bài viết!</h2>
        <Link to="/posts" style={{ color: 'var(--primary, #326e51)', marginTop: '10px' }}>Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '80vh', paddingBottom: '60px' }}>
      
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee', padding: '12px 0', marginBottom: '30px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666' }}>
            <Link to="/" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={14} /> Trang chủ
            </Link>
            <ChevronRight size={14} color="#ccc" />
            <Link to="/posts" style={{ color: '#666', textDecoration: 'none' }}>Góc làm đẹp</Link>
            <ChevronRight size={14} color="#ccc" />
            <span style={{ color: '#222', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
              {post.title}
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        <PostContent post={post} />
      </div>
    </div>
  );
}

export default PostDetailPage;
