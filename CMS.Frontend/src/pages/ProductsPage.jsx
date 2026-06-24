import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/Products/ProductList';
import CategorySidebar from '../components/Products/CategorySidebar';
import Pagination from '../components/Products/Pagination';
import ProductFilter from '../components/Products/ProductFilter';
import SortProduct from '../components/Products/SortProduct';
import { getProducts, getProductsByCategory, getCategories, searchProducts } from '../services/productService';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') ? parseInt(searchParams.get('category')) : 'all';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortValue, setSortValue] = useState('default');
  const [page, setPage] = useState(1);

  // Filters
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    let fetchPromise;

    if (searchKeyword) {
      fetchPromise = searchProducts(searchKeyword);
    } else if (selectedCategory !== 'all') {
      fetchPromise = getProductsByCategory(selectedCategory);
    } else {
      fetchPromise = getProducts();
    }

    fetchPromise
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [selectedCategory, searchKeyword]);

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    if (searchKeyword) {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  const handleResetFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
  };

  // Process data (Filter & Sort)
  let processed = [...products];

  if (minPrice) processed = processed.filter(p => p.price >= Number(minPrice));
  if (maxPrice) processed = processed.filter(p => p.price <= Number(maxPrice));
  if (inStockOnly) processed = processed.filter(p => p.stockQuantity > 0);

  if (sortValue === 'price_asc') processed.sort((a, b) => a.price - b.price);
  else if (sortValue === 'price_desc') processed.sort((a, b) => b.price - a.price);
  else if (sortValue === 'name_asc') processed.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortValue === 'newest') processed.sort((a, b) => b.id - a.id);

  // Pagination
  const pageSize = 12;
  const totalPages = Math.ceil(processed.length / pageSize);
  const pagedProducts = processed.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ backgroundColor: '#f5f5f5', padding: '30px 0', minHeight: '80vh' }}>
      <div className="container" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Sidebar */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <CategorySidebar 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelect={handleCategorySelect} 
          />
          <ProductFilter 
            minPrice={minPrice} maxPrice={maxPrice} inStockOnly={inStockOnly}
            onMinPrice={setMinPrice} onMaxPrice={setMaxPrice} onInStockOnly={setInStockOnly}
            onReset={handleResetFilter}
          />
        </div>

        {/* Main content */}
        <div style={{ flex: 1 }}>
          <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#333', margin: 0 }}>
              {searchKeyword ? `Kết quả tìm kiếm cho: "${searchKeyword}"` : (
                 selectedCategory === 'all' ? 'Tất Cả Sản Phẩm' : (categories.find(c => c.id === selectedCategory)?.name || 'Sản Phẩm')
              )}
            </h1>
            <SortProduct value={sortValue} onChange={setSortValue} />
          </div>

          {!loading && processed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="No results" style={{ width: '100px', opacity: 0.5, marginBottom: '20px' }} />
              <h3 style={{ fontSize: '18px', color: '#666' }}>Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.</h3>
            </div>
          ) : (
            <>
              <ProductList products={pagedProducts} loading={loading} />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
