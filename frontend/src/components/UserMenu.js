import React, { useState, useRef, useEffect } from 'react';

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    setIsOpen(false);
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu-button" onClick={() => setIsOpen(!isOpen)}>
        {user.firstName}
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={() => setIsOpen(false)}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
