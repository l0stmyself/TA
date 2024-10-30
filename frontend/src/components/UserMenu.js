import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="user-menu">
      <div className="user-menu-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span style={{marginRight: '0.5rem'}}>{user.firstName}</span>
        <Link><i className="fas fa-chevron-down"></i></Link>
      </div>
      {isOpen && (
        <div className="user-menu-dropdown">
          <Link to="/my-trips" className="menu-item">
            <i className="fas fa-car"></i> My Trips
          </Link>
          <div className="menu-item" onClick={onLogout}>
            <Link><i className="fas fa-sign-out-alt"></i> Logout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
