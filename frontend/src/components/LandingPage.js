import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h2>Welcome to TA Transportation</h2>
          <p>Your Campus Transportation & Delivery Solution</p>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Quick & Reliable</h3>
          <p>Fast and dependable transportation services within and around CMU campus.</p>
        </div>

        <div className="feature-card">
          <h3>Multiple Options</h3>
          <p>Choose from motorcycles, tricycles, or private cars based on your needs.</p>
        </div>

        <div className="feature-card">
          <h3>Safe & Secure</h3>
          <p>All our drivers are verified and trained to ensure your safety.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
