import React, { useState, useEffect } from 'react';
import Banner from '../components/Home/Banner';
import CategorySection from '../components/Home/CategorySection';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import NewProducts from '../components/Home/NewProducts';
import Promotion from '../components/Home/Promotion';
import BlogSection from '../components/Home/BlogSection';
import { getProducts, getCategories, getHotProducts } from '../services/productService';
import { getPosts } from '../services/postService';
import api from '../services/api';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingHotProducts, setLoadingHotProducts] = useState(true);
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
    getProducts(6)
      .then(data => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingProducts(false);
      });

    // Hot Products
    getHotProducts(6)
      .then(data => {
        setHotProducts(data);
        setLoadingHotProducts(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingHotProducts(false);
      });

    // Posts
    getPosts(4)
      .then(data => {
        setPosts(data);
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
      
      <div style={{ marginTop: '36px' }}>
        <FeaturedProducts products={hotProducts} loading={loadingHotProducts} />
      </div>
      
      <NewProducts products={products} loading={loadingProducts} />
      <BlogSection posts={posts.slice(0, 4)} loading={loadingPosts} />
    </main>
  );
}

export default HomePage;
