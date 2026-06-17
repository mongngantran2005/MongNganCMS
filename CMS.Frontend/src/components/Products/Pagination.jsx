import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination - Phân trang
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
    pages.push(i);
  }

  const btnBase = {
    width: '36px', height: '36px', border: '1px solid #ddd',
    borderRadius: '6px', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '14px',
    fontFamily: 'inherit', transition: 'all 0.2s',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '32px' }}>
      {/* Prev */}
      <button
        id="page-prev"
        style={{ ...btnBase, backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff', color: currentPage === 1 ? '#ccc' : '#333' }}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </button>

      {/* First page gap */}
      {pages[0] > 1 && (
        <>
          <button id="page-1" style={{ ...btnBase, backgroundColor: '#fff', color: '#333' }} onClick={() => onPageChange(1)}>1</button>
          {pages[0] > 2 && <span style={{ padding: '0 4px', color: '#999' }}>…</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map(p => (
        <button
          key={p}
          id={`page-${p}`}
          style={{
            ...btnBase,
            backgroundColor: p === currentPage ? 'var(--primary, #326e51)' : '#fff',
            color: p === currentPage ? '#fff' : '#333',
            borderColor: p === currentPage ? 'var(--primary, #326e51)' : '#ddd',
            fontWeight: p === currentPage ? '700' : '400',
          }}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {/* Last page gap */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span style={{ padding: '0 4px', color: '#999' }}>…</span>}
          <button id={`page-${totalPages}`} style={{ ...btnBase, backgroundColor: '#fff', color: '#333' }} onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      {/* Next */}
      <button
        id="page-next"
        style={{ ...btnBase, backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff', color: currentPage === totalPages ? '#ccc' : '#333' }}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;
