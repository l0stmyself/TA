import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/stores');
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = selectedCategory === 'all'
    ? stores
    : stores.filter(store => store.category === selectedCategory);

  return (
    <div className="store-list-page">
      <div className="breadcrumb">
        <span><Link to="/services">Services</Link></span>
        <span>Stores</span>
      </div>

      <div className="store-list-container">
        <h2>Nearby Stores</h2>
        
        <div className="category-filter">
          <button 
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'Groceries' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Groceries')}
          >
            Groceries
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'Stationary' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Stationary')}
          >
            Stationary
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'Medicines' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Medicines')}
          >
            Medicines
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'Food' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Food')}
          >
            Food
          </button>
        </div>

        <div className="stores-grid">
          {filteredStores.map(store => (
            <Link 
              to={`/services/purchase/${store.id}`} 
              key={store.id} 
              className="store-card"
            >
              <div className="store-image">
                <img src={store.image_url} alt={store.name} />
              </div>
              <div className="store-info">
                <h3>{store.name}</h3>
                <span className="store-category">{store.category}</span>
                <span className="store-distance">{store.distance} km away</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreList; 