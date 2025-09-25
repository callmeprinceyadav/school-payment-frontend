import React, { useState } from 'react';
import { transactionAPI } from '../utils/api';
import Navigation from '../components/Navigation';
import './TransactionStatus.css';

const TransactionStatus = () => {
  const [customOrderId, setCustomOrderId] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactionStatus = async () => {
    if (!customOrderId.trim()) {
      setError('Please enter a custom order ID');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Fetching transaction status for:', customOrderId.trim());
      const response = await transactionAPI.getTransactionStatus(customOrderId.trim());
      
      if (response && response.transaction) {
        setTransaction(response.transaction);
      }
    } catch (err) {
      console.error('Error fetching transaction status:', err);
      setError(err.response?.data?.message || 'Transaction not found');
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTransactionStatus();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusDisplay = (status) => {
    const statusConfig = {
      success: { 
        label: 'SUCCESS', 
        class: 'status-success', 
        icon: '✅',
        message: 'Payment completed successfully' 
      },
      pending: { 
        label: 'PENDING', 
        class: 'status-pending', 
        icon: '⏳',
        message: 'Payment is being processed' 
      },
      failed: { 
        label: 'FAILED', 
        class: 'status-failed', 
        icon: '❌',
        message: 'Payment was unsuccessful' 
      }
    };

    return statusConfig[status] || { 
      label: 'UNKNOWN', 
      class: 'status-unknown', 
      icon: '❓',
      message: 'Status unavailable' 
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const InfoRow = ({ label, value, className = '' }) => (
    <div className="info-row">
      <div className="info-label">{label}:</div>
      <div className={`info-value ${className}`}>{value || 'N/A'}</div>
    </div>
  );

  return (
    <div className="transaction-status-page">
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">🔍 Check Transaction Status</h1>

      {/* Search section */}
      <div className="status-search-panel">
        <div className="search-header">
          <h3>Transaction Status Lookup</h3>
          <p>Enter a custom order ID to check the current status of a transaction</p>
        </div>
        
        <div className="search-controls">
          <div className="input-group">
            <label className="input-label">Custom Order ID:</label>
            <input
              type="text"
              className="order-id-input"
              placeholder="Enter custom order ID (e.g., ORD_1234567890_abc12)"
              value={customOrderId}
              onChange={(e) => setCustomOrderId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <button
            className="status-search-btn"
            onClick={handleSearch}
            disabled={loading || !customOrderId.trim()}
          >
            {loading ? '🔄 Checking...' : '🔍 Check Status'}
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="error-alert">
          ⚠️ {error}
        </div>
      )}

      {/* Transaction details */}
      {transaction && (
        <div className="transaction-details">
          {/* Status header */}
          <div className="status-header">
            <div className="status-main">
              <div className="status-icon">
                {getStatusDisplay(transaction.status).icon}
              </div>
              <div className="status-info">
                <h2>Transaction Status</h2>
                <div className={`status-badge ${getStatusDisplay(transaction.status).class}`}>
                  {getStatusDisplay(transaction.status).label}
                </div>
                <p className="status-message">
                  {getStatusDisplay(transaction.status).message}
                </p>
              </div>
            </div>
            <div className="status-time">
              <div className="time-label">Last Updated</div>
              <div className="time-value">{formatDate(transaction.payment_time)}</div>
            </div>
          </div>

          {/* Transaction information */}
          <div className="transaction-info">
            <div className="info-section">
              <h3 className="section-title">📄 Order Information</h3>
              <div className="info-grid">
                <InfoRow label="Custom Order ID" value={transaction.custom_order_id} className="monospace" />
                <InfoRow label="Collect ID" value={transaction.collect_id} className="monospace" />
                <InfoRow label="School ID" value={transaction.school_id} className="monospace" />
                <InfoRow label="Gateway" value={transaction.gateway} />
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title">👤 Student Information</h3>
              <div className="info-grid">
                <InfoRow label="Student Name" value={transaction.student_info?.name || transaction.student_name} />
                <InfoRow label="Student ID" value={transaction.student_info?.id} className="monospace" />
                <InfoRow label="Student Email" value={transaction.student_info?.email || transaction.student_email} />
                <InfoRow label="Student Class" value={transaction.student_info?.class} />
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title">💰 Payment Information</h3>
              <div className="info-grid">
                <InfoRow label="Order Amount" value={transaction.order_amount ? `₹${transaction.order_amount}` : 'N/A'} className="amount" />
                <InfoRow label="Transaction Amount" value={transaction.transaction_amount ? `₹${transaction.transaction_amount}` : 'N/A'} className="amount" />
                <InfoRow label="Payment Mode" value={transaction.payment_mode?.toUpperCase()} />
                <InfoRow label="Bank Reference" value={transaction.bank_reference} className="monospace" />
              </div>
            </div>

            {/* Additional details */}
            {(transaction.payment_details || transaction.payment_message || transaction.error_message) && (
              <div className="info-section">
                <h3 className="section-title">ℹ️ Additional Details</h3>
                <div className="info-grid">
                  {transaction.payment_details && (
                    <InfoRow label="Payment Details" value={transaction.payment_details} />
                  )}
                  {transaction.payment_message && (
                    <InfoRow label="Payment Message" value={transaction.payment_message} />
                  )}
                  {transaction.error_message && transaction.error_message !== 'NA' && (
                    <InfoRow label="Error Message" value={transaction.error_message} className="error-text" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!transaction && !loading && !error && customOrderId === '' && (
        <div className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">🔍</div>
            <h3>Check Transaction Status</h3>
            <p>Enter a custom order ID above to check the transaction status</p>
            <p className="help-text">The custom order ID is returned when creating a payment</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TransactionStatus;
