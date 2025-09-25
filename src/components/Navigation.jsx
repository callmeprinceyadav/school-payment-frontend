import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="nav-header">
      <div className="nav-brand">
        <h1 className="nav-title">💳 School Payment Dashboard</h1>
      </div>
      
      <div className="nav-menu">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') || isActive('/dashboard') ? 'active' : ''}`}
        >
          📊 Dashboard
        </Link>
        <Link 
          to="/transactions-by-school" 
          className={`nav-link ${isActive('/transactions-by-school') ? 'active' : ''}`}
        >
          🏫 School Transactions
        </Link>
        <Link 
          to="/transaction-status" 
          className={`nav-link ${isActive('/transaction-status') ? 'active' : ''}`}
        >
          🔍 Transaction Status
        </Link>
        <Link 
          to="/all-transactions" 
          className={`nav-link ${isActive('/all-transactions') ? 'active' : ''}`}
        >
          📋 All Transactions
        </Link>
      </div>
      
      <div className="nav-user">
        <span className="user-name">👤 {user?.name || user?.email || 'Admin'}</span>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Navigation;