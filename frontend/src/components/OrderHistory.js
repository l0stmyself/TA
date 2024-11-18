import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="order-history-page">
      <div className="breadcrumb">
        <span><Link to="/services">Services</Link></span>
        <span>Order History</span>
      </div>

      <h2>My Orders</h2>

      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="no-orders">
            <i className="fas fa-shopping-bag"></i>
            <p>No orders yet</p>
            <Link to="/services/purchase" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="store-info">
                  <img src={order.store_image} alt={order.store_name} />
                  <h3>{order.store_name}</h3>
                </div>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.image_url} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>₱{(item.price_at_time * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-info">
                  <p>Ordered on: {formatDate(order.created_at)}</p>
                  <p>Delivery to: {order.delivery_address}</p>
                </div>
                <div className="order-total">
                  <span>Total:</span>
                  <span>₱{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory; 