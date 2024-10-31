import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute';

const PurchaseService = () => {
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
    <>
      <div className="breadcrumb">
        <span>
          <Link to="/services">Services</Link>
        </span>
        <span>Purchase Service</span>
      </div>

      <section className="service-detail-section">
        <h2>Purchase Service</h2>

        <div className="purchase-service-content">
          <div className="service-description-card">
            <i className="fas fa-shopping-basket service-icon"></i>
            <h3>How It Works</h3>
            <div className="steps-container">
              <div className="step">
                <i className="fas fa-store step-icon"></i>
                <h4>1. Select Store</h4>
                <p>Choose from our partner stores</p>
              </div>
              <div className="step">
                <i className="fas fa-shopping-cart step-icon"></i>
                <h4>2. Select Items</h4>
                <p>Browse and add items to cart</p>
              </div>
              <div className="step">
                <i className="fas fa-money-bill-wave step-icon"></i>
                <h4>3. Place Order</h4>
                <p>Confirm and pay for your order</p>
              </div>
              <div className="step">
                <i className="fas fa-truck step-icon"></i>
                <h4>4. Delivery</h4>
                <p>Items delivered to your location</p>
              </div>
            </div>
          </div>

          <div className="stores-section">
            <div className="category-filter">
              <button 
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Stores
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

            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading stores...</p>
              </div>
            ) : (
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
                      <span className="store-distance">
                        <i className="fas fa-map-marker-alt"></i>
                        {store.distance} km away
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="service-info">
          <h3>Service Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <i className="fas fa-clock"></i>
              <h4>Real-time Updates</h4>
              <p>Track your order status live</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-shield-alt"></i>
              <h4>Secure Payments</h4>
              <p>Multiple payment options</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-hand-holding-heart"></i>
              <h4>Careful Handling</h4>
              <p>Items handled with care</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-headset"></i>
              <h4>24/7 Support</h4>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default function WrappedPurchaseService() {
  return (
    <ProtectedRoute>
      <PurchaseService />
    </ProtectedRoute>
  );
}
