import React from 'react';

/**
 * OrderButton - Nút đặt hàng trong checkout
 */
function OrderButton({ onClick, loading = false, disabled = false }) {
  return (
    <button
      id="place-order-btn"
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%', padding: '15px',
        backgroundColor: disabled || loading ? '#ccc' : '#FF6600',
        color: '#fff', border: 'none', borderRadius: '6px',
        fontSize: '16px', fontWeight: '700',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        textTransform: 'uppercase', letterSpacing: '0px',
        transition: 'background 0.2s', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
      }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.background = '#E55A00'; }}
      onMouseLeave={e => { if (!disabled && !loading) e.currentTarget.style.background = '#FF6600'; }}
    >
      {loading ? (
        <>
          <span style={{ width: '18px', height: '18px', border: '3px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
          Đang xử lý...
        </>
      ) : (
        '🛒 Đặt Hàng Ngay'
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}

export default OrderButton;
