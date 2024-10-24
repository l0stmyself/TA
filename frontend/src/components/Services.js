import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <>
      <div className="breadcrumb">
        <span>Services</span>
      </div>
      
      <section className="services-section">
        <h2>Our Services</h2>
        <div className="service-cards">
          <Link to="/services/transportation" className="service-card">
            <i className="fas fa-car service-icon"></i>
            <h3>Transportation</h3>
            <p>Choose your ride:</p>
            <div className="transport-options">
              <span><i className="fas fa-motorcycle"></i> Motorbike</span>
              <span><i className="fas fa-taxi"></i> Private Cab</span>
              <span><i className="fas fa-car"></i> Tricycle</span>
            </div>
            <p>Get around campus quickly and safely with our verified drivers.</p>
          </Link>

          <Link to="/services/purchase" className="service-card">
            <i className="fas fa-shopping-basket service-icon"></i>
            <h3>Purchase Service</h3>
            <p>Need something from nearby stores?</p>
            <ul className="features-list">
              <li>Quick store purchases</li>
              <li>Real-time order tracking</li>
              <li>Secure payment options</li>
              <li>Verified delivery drivers</li>
            </ul>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Services;
