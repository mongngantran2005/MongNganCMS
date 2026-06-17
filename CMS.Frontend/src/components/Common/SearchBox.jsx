import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

/**
 * SearchBox - Ô tìm kiếm sản phẩm
 */
function SearchBox({ placeholder = 'Tìm kiếm sản phẩm...', initialValue = '' }) {
  const [text, setText] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      navigate(`/products?search=${encodeURIComponent(text.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--primary, #326e51)', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fff' }}
    >
      <input
        id="search-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, padding: '10px 14px', border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit' }}
      />
      <button
        id="search-btn"
        type="submit"
        style={{ padding: '0 16px', height: '100%', backgroundColor: 'var(--primary, #326e51)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <Search size={18} />
      </button>
    </form>
  );
}

export default SearchBox;
