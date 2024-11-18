import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    fetchCartItems();
    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/cart', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error loading cart items');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }
    
    mapInstanceRef.current = L.map(mapRef.current).setView([14.2691, 121.4113], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current);
    markerRef.current = L.marker([14.2691, 121.4113]).addTo(mapInstanceRef.current);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleLocationSelect = (location) => {
    const newLocation = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
      address: location.display_name
    };
    
    setSelectedLocation(newLocation);
    setSearchQuery(location.display_name);
    setSearchResults([]);

    mapInstanceRef.current.setView([newLocation.lat, newLocation.lng], 15);
    markerRef.current.setLatLng([newLocation.lat, newLocation.lng])
      .bindPopup(location.display_name)
      .openPopup();
  };

  const calculateTotal = () => {
    const itemsTotal = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    const deliveryFee = (selectedLocation && cartItems[0]?.store_distance) 
      ? parseFloat((cartItems[0].store_distance * 15).toFixed(2))
      : 0;
    
    const total = parseFloat((itemsTotal + deliveryFee).toFixed(2));
    
    return {
      itemsTotal: parseFloat(itemsTotal.toFixed(2)),
      deliveryFee,
      total
    };
  };

  const handlePlaceOrder = async () => {
    if (!selectedLocation) {
      toast.error('Please select a delivery location');
      return;
    }

    try {
      const totals = calculateTotal();
      const orderData = {
        storeId: cartItems[0].store_id,
        deliveryDetails: {
          ...selectedLocation,
          distance: cartItems[0].store_distance,
          deliveryFee: totals.deliveryFee,
          totalAmount: totals.total
        }
      };

      console.log(orderData);

      await axios.post('http://localhost:4000/api/orders', orderData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Order placed successfully!');
      setTimeout(() => navigate('/my-orders'), 3000);
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order');
    }
  };

  const totals = calculateTotal();

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>₱{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="subtotal">
              <span>Items Total:</span>
              <span>₱{totals.itemsTotal.toFixed(2)}</span>
            </div>
            <div className="delivery-fee">
              <span>Delivery Fee:</span>
              <span>₱{totals.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="total">
              <span>Total:</span>
              <span>₱{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="delivery-location">
          <h2>Delivery Location</h2>
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a location..."
              className="location-input"
            />
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map(result => (
                  <li 
                    key={result.place_id}
                    onClick={() => handleLocationSelect(result)}
                  >
                    {result.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div ref={mapRef} className="map-container"></div>

          {selectedLocation && (
            <div className="selected-location-info">
              <h3>Selected Location:</h3>
              <p>{selectedLocation.address}</p>
            </div>
          )}

          <button 
            className="btn btn-primary place-order-btn"
            onClick={handlePlaceOrder}
            disabled={!selectedLocation}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 