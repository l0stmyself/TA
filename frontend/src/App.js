import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles.css'; // Import the new styles.css
import Register from './components/Register';
import Login from './components/Login';
import UserMenu from './components/UserMenu';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1>TA Transportation</h1>
            <div className="auth-section">
              {user ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <a href="/login" className="btn btn-primary">Login</a>
                  <a href="/register" className="btn btn-secondary">Register Now</a>
                </>
              )}
            </div>
          </div>
          <p className="tagline">Your Campus Transportation & Delivery Solution</p>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const LandingPage = () => (
  <section className="services-section">
    <h2>Our Services</h2>
    <div className="service-cards">
      <div className="service-card">
        <i className="fas fa-car service-icon"></i>
        <h3>Campus Transportation</h3>
        <p>Choose your ride:</p>
        <div className="transport-options">
          <span><i className="fas fa-motorcycle"></i> Motorbike</span>
          <span><i className="fas fa-bus"></i> Jeepney</span>
          <span><i className="fas fa-car"></i> Tricycle</span>
        </div>
        <p>Get around campus quickly and safely with our verified drivers.</p>
      </div>
      <div className="service-card">
        <i className="fas fa-shopping-basket service-icon"></i>
        <h3>Purchase Service</h3>
        <p>Need something from nearby stores?</p>
        <ul className="features-list">
          <li>Quick store purchases</li>
          <li>Real-time order tracking</li>
          <li>Secure payment options</li>
          <li>Verified delivery drivers</li>
        </ul>
      </div>
    </div>
  </section>
);

export default App;
