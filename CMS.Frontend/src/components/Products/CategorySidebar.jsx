import React from 'react';

/**
 * CategorySidebar - Sidebar danh mục sản phẩm có thể thu gọn
 */
function CategorySidebar({ categories, selectedCategory, onSelect }) {
  const BACKEND_URL = 'http://localhost:5188';
  const getImg = (url) => (!url ? null : url.startsWith('http') ? url : `${BACKEND_URL}${url}`);

  return (
    <div style={{
      width: '240px', flexShrink: 0,
      backgroundColor: '#fff', borderRadius: '8px',
      padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
    }}>
      <h3 style={{
        fontSize: '14px', fontWeight: '700', textTransform: 'uppercase',
        color: '#333', borderBottom: '2px solid var(--primary, #326e51)',
        paddingBottom: '10px', marginBottom: '14px',
        display: 'flex', alignItems: 'center', gap: '6px'
      }}>
        ☰ Danh Mục
      </h3>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {/* Tất cả */}
        <li style={{ marginBottom: '4px' }}>
          <div
            id="cat-all"
            onClick={() => onSelect('all')}
            style={{
              cursor: 'pointer', padding: '8px 10px', borderRadius: '6px',
              fontWeight: selectedCategory === 'all' ? '700' : '400',
              color: selectedCategory === 'all' ? 'var(--primary, #326e51)' : '#333',
              backgroundColor: selectedCategory === 'all' ? '#f0faf5' : 'transparent',
              transition: 'all 0.2s', fontSize: '14px',
            }}
          >
            Tất cả sản phẩm
          </div>
        </li>

        {/* Parent categories */}
        {categories.filter(c => !c.parentId).map(cat => {
          const children = categories.filter(c => c.parentId === cat.id);
          const isActive = selectedCategory === cat.id || children.some(c => c.id === selectedCategory);

          return (
            <li key={cat.id} style={{ marginBottom: '4px' }}>
              <div
                id={`cat-${cat.id}`}
                onClick={() => onSelect(cat.id)}
                style={{
                  cursor: 'pointer', padding: '8px 10px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontWeight: isActive ? '700' : '400',
                  color: isActive ? 'var(--primary, #326e51)' : '#333',
                  backgroundColor: isActive ? '#f0faf5' : 'transparent',
                  transition: 'all 0.2s', fontSize: '14px',
                }}
              >
                {cat.imageUrl && (
                  <img src={getImg(cat.imageUrl)} alt={cat.name}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
                <span style={{ flex: 1 }}>{cat.name}</span>
                {children.length > 0 && (
                  <span style={{ fontSize: '10px', color: '#999' }}>{isActive ? '▼' : '▶'}</span>
                )}
              </div>

              {/* Children */}
              {isActive && children.length > 0 && (
                <ul style={{ listStyle: 'none', paddingLeft: '30px', margin: '4px 0 8px' }}>
                  {children.map(child => (
                    <li key={child.id}>
                      <div
                        id={`cat-child-${child.id}`}
                        onClick={(e) => { e.stopPropagation(); onSelect(child.id); }}
                        style={{
                          cursor: 'pointer', padding: '6px 8px', borderRadius: '4px',
                          fontSize: '13px',
                          color: selectedCategory === child.id ? 'var(--primary, #326e51)' : '#555',
                          fontWeight: selectedCategory === child.id ? '600' : '400',
                          transition: 'all 0.2s',
                        }}
                      >
                        {child.name}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CategorySidebar;
