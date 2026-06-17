import React from 'react';

/**
 * Loading - Spinner loading tái sử dụng
 */
function Loading({ text = 'Đang tải...', fullPage = false }) {
  const containerStyle = fullPage
    ? { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }
    : { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', flexDirection: 'column', gap: '12px' };

  return (
    <div style={containerStyle}>
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e5e5',
          borderTopColor: 'var(--primary, #326e51)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{text}</p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Loading;
