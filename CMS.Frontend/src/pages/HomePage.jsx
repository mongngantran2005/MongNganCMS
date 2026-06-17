import React, { useState, useEffect } from 'react';
import Banner from '../components/Home/Banner';
import CategorySection from '../components/Home/CategorySection';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import NewProducts from '../components/Home/NewProducts';
import Promotion from '../components/Home/Promotion';
import BlogSection from '../components/Home/BlogSection';
import { getProducts, getCategories } from '../services/productService';
import { getPosts } from '../services/postService';
import api from '../services/api';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    // Banners
    api.get('/banners')
      .then(res => setBanners(res.data))
      .catch(console.error);

    // Categories
    getCategories()
      .then(data => setCategories(data))
      .catch(console.error);

    // Products
    getProducts()
      .then(data => {
        const sorted = data.sort((a, b) => b.id - a.id);
        setProducts(sorted);
        setLoadingProducts(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingProducts(false);
      });

    // Posts
    getPosts()
      .then(data => {
        setPosts(data.sort((a, b) => b.id - a.id).slice(0, 3));
        setLoadingPosts(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingPosts(false);
      });
  }, []);

  return (
    <main className="main-content container">
      <Banner banners={banners} />
      <div style={{ marginTop: '36px' }}>
        <CategorySection categories={categories} />
      </div>
      {/* Ẩn theo yêu cầu */}
      {/* <Promotion /> */}
      {/* <FeaturedProducts products={products.slice(0, 10)} loading={loadingProducts} /> */}
      
      <NewProducts products={products.slice(0, 12)} loading={loadingProducts} />
      <BlogSection posts={posts.slice(0, 4)} loading={loadingPosts} />
    </main>
  );
}

export default HomePage;
