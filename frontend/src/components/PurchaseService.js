import React from 'react';
import { Link } from 'react-router-dom';

const PurchaseService = () => {
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
                <i className="fas fa-list-alt step-icon"></i>
                <h4>1. Place Your Order</h4>
                <p>Tell us what you need and where to get it</p>
              </div>
              <div className="step">
                <i className="fas fa-user-check step-icon"></i>
                <h4>2. Driver Assignment</h4>
                <p>We'll match you with a nearby driver</p>
              </div>
              <div className="step">
                <i className="fas fa-shopping-cart step-icon"></i>
                <h4>3. Purchase</h4>
                <p>Your driver will buy the items</p>
              </div>
              <div className="step">
                <i className="fas fa-truck step-icon"></i>
                <h4>4. Delivery</h4>
                <p>Items delivered to your location</p>
              </div>
            </div>
          </div>

          <div className="order-form-card">
            <h3>Place an Order</h3>
            <form className="purchase-form">
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Store Name"
                  required 
                />
              </div>
              <div className="form-group">
                <textarea 
                  placeholder="List the items you need..."
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Delivery Location"
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit Order</button>
            </form>
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

export default PurchaseService;
