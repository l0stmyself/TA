import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate, Link } from 'react-router-dom';
import './styles.css'; // Import the new styles.css
import Register from './components/Register';
import Login from './components/Login';
import UserMenu from './components/UserMenu';
import Services from './components/Services';
import Transportation from './components/Transportation';
import PurchaseService from './components/PurchaseService';
import MotorcycleBooking from './components/MotorcycleBooking';
import TripDetails from './components/TripDetails';
import LandingPage from './components/LandingPage'; // Assuming you move LandingPage to its own component
import DestinationBooking from './components/DestinationBooking';
import MyTrips from './components/MyTrips';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // If JSON parsing fails, clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        // Clear everything if either token or user is missing
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

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
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-secondary">Register Now</Link>
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
          <Route 
            path="/login" 
            element={user ? <Navigate to="/services" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/services" /> : <Register />} 
          />
          <Route 
            path="/services" 
            element={user ? <Services /> : <Navigate to="/login" state={{ from: '/services' }} />} 
          />
          <Route 
            path="/services/transportation" 
            element={user ? <Transportation /> : <Navigate to="/login" state={{ from: '/services/transportation' }} />} 
          />
          <Route 
            path="/services/transportation/motorcycle" 
            element={user ? <MotorcycleBooking /> : <Navigate to="/login" state={{ from: '/services/transportation/motorcycle' }} />} 
          />
          <Route 
            path="/services/transportation/motorcycle/trip-details" 
            element={user ? <TripDetails /> : <Navigate to="/login" state={{ from: '/services/transportation/motorcycle/trip-details' }} />} 
          />
          <Route 
            path="/services/transportation/motorcycle/destination" 
            element={user ? <DestinationBooking /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/services/purchase" 
            element={user ? <PurchaseService /> : <Navigate to="/login" state={{ from: '/services/purchase' }} />} 
          />
          <Route 
            path="/my-trips" 
            element={user ? <MyTrips /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
