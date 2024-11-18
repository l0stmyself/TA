import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartModal from './CartModal';

const CartIcon = () => {
  const [cartCount, setCartCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/cart', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setCartCount(response.data.length);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleCheckout = () => {
    setShowModal(false);
    navigate('/services/purchase/checkout');
  };

  return (
    <div className="cart-icon-container">
      <button className="cart-icon-btn" onClick={() => setShowModal(true)}>
        <i className="fas fa-shopping-cart"></i>
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </button>
      <CartModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default CartIcon; 