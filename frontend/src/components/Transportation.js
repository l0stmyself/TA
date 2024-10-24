import React from 'react';
import { Link } from 'react-router-dom';

const Transportation = () => {
  return (
    <>
      <div className="breadcrumb">
        <span>
          <Link to="/services">Services</Link>
        </span>
        <span>Transportation</span>
      </div>

      <section className="service-detail-section">
        <h2>Transportation Service</h2>
        
        <div className="transport-options-grid">
          <div className="transport-option-card">
            <i className="fas fa-motorcycle transport-icon"></i>
            <h3>Motorbike</h3>
            <p className="price">Starting from ₱50</p>
            <ul className="feature-list">
              <li>Quick and agile</li>
              <li>Perfect for solo riders</li>
              <li>Ideal for short distances</li>
              <li>Fast arrival time</li>
            </ul>
            <button className="btn btn-primary">Book Now</button>
          </div>

          <div className="transport-option-card">
            <i className="fas fa-taxi transport-icon"></i>
            <h3>Private Cab</h3>
            <p className="price">Starting from ₱150</p>
            <ul className="feature-list">
              <li>Comfortable seating</li>
              <li>Air-conditioned</li>
              <li>Suitable for groups</li>
              <li>Available for long trips</li>
            </ul>
            <button className="btn btn-primary">Book Now</button>
          </div>

          <div className="transport-option-card">
            <i className="fas fa-car transport-icon"></i>
            <h3>Tricycle</h3>
            <p className="price">Starting from ₱75</p>
            <ul className="feature-list">
              <li>Local transportation</li>
              <li>Good for small groups</li>
              <li>Affordable rates</li>
              <li>Easy to book</li>
            </ul>
            <button className="btn btn-primary">Book Now</button>
          </div>
        </div>

        <div className="service-info">
          <h3>Important Information</h3>
          <ul className="info-list">
            <li>All drivers are verified and licensed</li>
            <li>Real-time tracking available</li>
            <li>24/7 customer support</li>
            <li>Cashless payment options</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Transportation;
