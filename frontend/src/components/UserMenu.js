import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="user-menu">
      <div className="user-menu-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{user.name}</span>
        <i className="fas fa-chevron-down"></i>
      </div>
      {isOpen && (
        <div className="user-menu-dropdown">
          <Link to="/my-trips" className="menu-item">
            <i className="fas fa-car"></i> My Trips
          </Link>
          <div className="menu-item" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
