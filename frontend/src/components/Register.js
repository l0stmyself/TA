import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    mobileNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      await axios.post('http://localhost:4000/api/auth/register', registrationData);
      setSuccess('Registration successful!');
      setError('');
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        mobileNumber: ''
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <>
      <div className="breadcrumb">
        <span>
          <Link to="/">Home</Link>
        </span>
        <span>Register</span>
      </div>
      <div className="form-container">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-secondary">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;
