import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import './styles.css'; // Import the new styles.css
import Register from './components/Register';
import Login from './components/Login';
import UserMenu from './components/UserMenu';
import Services from './components/Services';
import Transportation from './components/Transportation';
import PurchaseService from './components/PurchaseService';
import MotorcycleBooking from './components/MotorcycleBooking';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Add this hook

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
    navigate('/'); // Navigate to landing page instead of login
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-wrapper">
          <div className="header-content">
            <h1>TA Transportation</h1>
          </div>
          <div className="header-actions">
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <div className="auth-buttons">
                <a href="/login" className="btn btn-primary">Login</a>
                <a href="/register" className="btn btn-secondary">Register Now</a>
              </div>
            )}
          </div>
          <div className="header-tagline">
            <p className="tagline">Your Campus Transportation & Delivery Solution</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/services" /> : <LandingPage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={user ? <Services /> : <Navigate to="/login" />} />
          <Route path="/services/transportation" element={user ? <Transportation /> : <Navigate to="/login" />} />
          <Route path="/services/transportation/motorcycle" element={user ? <MotorcycleBooking /> : <Navigate to="/login" />} />
          <Route path="/services/purchase" element={user ? <PurchaseService /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

const LandingPage = () => (
  <section className="landing-section">
    <div className="landing-content">
      <h1>Welcome to TA Transportation</h1>
      
      <div className="content-blocks">
        <div className="content-block">
          <h2>Your Campus Transportation Solution</h2>
          <p>TA Transportation specializes in accessibility, convenience, comfortability and easy-to-use transport services tailored to meet the diverse needs of our clients. Whether you're looking for personal transportation, buying your needs, or getting the things you forgot, our dedicated team and drivers ensure timely delivery and exceptional customer service.</p>
        </div>

        <div className="content-block">
          <h2>Modern Fleet & Flexible Service</h2>
          <p>Our fleet consists of modern, well-maintained motorcycles equipped with the latest technology for tracking and safety. We offer flexible scheduling to cater to the customer's needs, can book ahead of time and routes to accommodate your specific services needed, whether it's inside CMU or outside CMU long-distance travel. We also deal with selecting your own driver for your comfort while availing of our services.</p>
        </div>

        <div className="content-block">
          <h2>Safety & Reliability</h2>
          <p>With a focus on accessibility and efficiency, we prioritize the security and safety of our dear customers. Our experienced drivers are acquiring the sense of navigation, responsible and reliable, and committed to delivering your needs. And you safely and on time.</p>
        </div>

        <div className="content-block highlight">
          <p>Choose TA Transportation for smooth, trusted transportation services that help you advance.</p>
        </div>
      </div>
    </div>
  </section>
);

// Wrapper component with the single Router
const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper; // Export AppWrapper instead of App
