import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate, Link } from 'react-router-dom';
import './styles.css'; // Import the new styles.css
import Register from './components/Register';
import Login from './components/Login';
import UserMenu from './components/UserMenu';
import Services from './components/Services';
import WrappedTransportation from './components/Transportation';
import WrappedMotorcycleBooking from './components/MotorcycleBooking';
import WrappedTripDetails from './components/TripDetails';
import WrappedDestinationBooking from './components/DestinationBooking';
import WrappedPurchaseService from './components/PurchaseService';
import WrappedMyTrips from './components/MyTrips';
import LandingPage from './components/LandingPage'; // Assuming you move LandingPage to its own component
import WrappedCheckout from './components/Checkout';
import CartIcon from './components/CartIcon';
import WrappedOrderHistory from './components/OrderHistory';
import WrappedStoreDetails from './components/StoreDetails';

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
              <>
                <CartIcon />
                <UserMenu user={user} onLogout={handleLogout} />
              </>
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/transportation" element={<WrappedTransportation />} />
          <Route path="/services/transportation/motorcycle" element={<WrappedMotorcycleBooking />} />
          <Route path="/services/transportation/motorcycle/trip-details" element={<WrappedTripDetails />} />
          <Route path="/services/transportation/motorcycle/destination" element={<WrappedDestinationBooking />} />
          <Route path="/services/purchase" element={<WrappedPurchaseService />} />
          <Route path="/services/purchase/:id" element={<WrappedStoreDetails />} />
          <Route path="/services/purchase/checkout" element={<WrappedCheckout />} />
          <Route path="/my-trips" element={<WrappedMyTrips />} />
          <Route path="/my-orders" element={<WrappedOrderHistory />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
