import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

const StoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const { updateCartCount } = useCart();

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/stores/${id}`);
        setStore(response.data);
        // Convert price strings to numbers
        const itemsWithNumericPrices = response.data.items.map(item => ({
          ...item,
          price: parseFloat(item.price)
        }));
        setItems(itemsWithNumericPrices);
        
        // Initialize quantities
        const initialQuantities = {};
        response.data.items.forEach(item => {
          initialQuantities[item.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching store details:', error);
        toast.error('Error loading store details');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [id]);

  const handleQuantityChange = (itemId, value) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const addToCart = async (item) => {
    try {
      await axios.post('http://localhost:4000/api/cart/add', {
        itemId: item.id,
        quantity: quantities[item.id],
        storeId: store.id,
        price: item.price,
        name: item.name,
        image_url: item.image_url,
        store_name: store.name,
        store_distance: store.distance
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Fetch updated cart count
      const cartResponse = await axios.get('http://localhost:4000/api/cart', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      updateCartCount(cartResponse.data.length);
      
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error('Error adding to cart');
      }
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="store-details-page">
      <div className="breadcrumb">
        <span><Link to="/services">Services</Link></span>
        <span><Link to="/services/purchase">Stores</Link></span>
        <span>{store.name}</span>
      </div>

      <div className="store-header">
        <div className="store-image">
          <img src={store.image_url} alt={store.name} />
        </div>
        <div className="store-info">
          <h2>{store.name}</h2>
          <span className="store-category">{store.category}</span>
          <span className="store-distance">{store.distance} km away</span>
        </div>
      </div>

      <div className="items-grid">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-image">
              <img src={item.image_url} alt={item.name} />
            </div>
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <span className="item-category">{item.category}</span>
              <span className="item-price">₱{item.price.toFixed(2)}</span>
              <div className="item-actions">
                <select 
                  value={quantities[item.id]} 
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <button 
                  className="btn btn-primary"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreDetails; 