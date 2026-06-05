import React from 'react';

function Footer() {
  return (
    <footer style={{
      background: 'rgba(15, 23, 42, 0.9)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '40px 0',
      marginTop: '60px',
      textAlign: 'center',
      color: '#94a3b8'
    }}>
      <div className="container">
        <h3 style={{ color: '#fff', marginBottom: '10px' }}>MongNgan CMS</h3>
        <p>© 2026 Bản quyền thuộc về MongNgan. Xây dựng bằng ASP.NET Core & ReactJS.</p>
      </div>
    </footer>
  );
}

export default Footer;
