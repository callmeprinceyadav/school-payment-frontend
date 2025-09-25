import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { transactionAPI } from '../utils/api';
import Navigation from '../components/Navigation';
import './TransactionsBySchool.css';

const TransactionsBySchool = () => {
  const [schoolId, setSchoolId] = useState('65b0e6293e9f76a9694d84b4');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const fetchSchoolTransactions = async () => {
    if (!schoolId.trim()) {
      setError('Please enter a school ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const params = {
        page: page + 1,
        limit: pageSize,
      };

      console.log('Fetching school transactions with params:', params);
      const response = await transactionAPI.getTransactionsBySchool(schoolId.trim(), params);
      
      if (response && response.transactions) {
        setTransactions(response.transactions);
        setTotalCount(response.pagination?.total_records || 0);
        setSearchPerformed(true);
      }
    } catch (err) {
      console.error('Error fetching school transactions:', err);
      setError(err.response?.data?.message || 'Failed to fetch school transactions');
      setTransactions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchPerformed) {
      fetchSchoolTransactions();
    }
  }, [page, pageSize]);

  const handleSearch = () => {
    setPage(0);
    fetchSchoolTransactions();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'success': return 'payment-success';
      case 'pending': return 'payment-pending';
      case 'failed': return 'payment-failed';
      default: return 'payment-unknown';
    }
  };

  const columns = [
    {
      field: 'custom_order_id',
      headerName: 'Order ID',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div className="order-number">{params.value || 'N/A'}</div>
      )
    },
    {
      field: 'student_name',
      headerName: 'Student Name',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div className="student-info">{params.value || 'N/A'}</div>
      )
    },
    {
      field: 'student_email',
      headerName: 'Student Email',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <div className="student-email">{params.value || 'N/A'}</div>
      )
    },
    {
      field: 'order_amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <div className="payment-amount">₹{params.value || 0}</div>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => (
        <span className={`payment-status ${getStatusClass(params.value)}`}>
          {params.value?.toUpperCase() || 'UNKNOWN'}
        </span>
      )
    },
    {
      field: 'payment_mode',
      headerName: 'Payment Mode',
      width: 120,
      renderCell: (params) => (
        <span className="payment-method">
          {params.value?.toUpperCase() || 'N/A'}
        </span>
      )
    },
    {
      field: 'payment_time',
      headerName: 'Payment Time',
      width: 160,
      renderCell: (params) => (
        <div className="transaction-time">
          {params.value ? new Date(params.value).toLocaleString() : 'N/A'}
        </div>
      )
    }
  ];

  return (
    <div className="transactions-by-school-page">
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">🏫 Transactions by School</h1>

      {/* Search section */}
      <div className="search-panel">
        <div className="search-header">
          <h3>Search School Transactions</h3>
          <p>Enter a school ID to view all transactions for that school</p>
        </div>
        
        <div className="search-controls">
          <div className="input-group">
            <label className="input-label">School ID:</label>
            <input
              type="text"
              className="school-id-input"
              placeholder="Enter school ID (e.g., 65b0e6293e9f76a9694d84b4)"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading || !schoolId.trim()}
          >
            {loading ? '🔄 Searching...' : '🔍 Search Transactions'}
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="error-alert">
          ⚠️ {error}
        </div>
      )}

      {/* Results summary */}
      {searchPerformed && !loading && transactions.length > 0 && (
        <div className="results-summary">
          <div className="summary-card">
            <h4>📊 Search Results</h4>
            <p>Found <strong>{totalCount}</strong> transactions for school ID: <strong>{schoolId}</strong></p>
          </div>
        </div>
      )}

      {/* Transactions table */}
      <div className="school-transactions-table">
        <DataGrid
          rows={transactions.map((transaction, index) => ({
            id: transaction.collect_id || `school-trans-${index}`,
            ...transaction
          }))}
          columns={columns}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          rowCount={totalCount}
          paginationMode="server"
          loading={loading}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          className="school-data-grid"
          slots={{
            noRowsOverlay: () => (
              <div className="no-data-overlay">
                <div className="no-data-content">
                  {searchPerformed ? (
                    <>
                      <div className="no-data-icon">📋</div>
                      <h3>No Transactions Found</h3>
                      <p>No transactions found for school ID: <strong>{schoolId}</strong></p>
                      <p>Try searching with a different school ID</p>
                    </>
                  ) : (
                    <>
                      <div className="no-data-icon">🔍</div>
                      <h3>Search School Transactions</h3>
                      <p>Enter a school ID above to search for transactions</p>
                    </>
                  )}
                </div>
              </div>
            ),
            loadingOverlay: () => (
              <div className="loading-overlay">
                <div className="loading-spinner">🔄</div>
                <p>Searching for transactions...</p>
              </div>
            )
          }}
        />
      </div>
      </div>
    </div>
  );
};

export default TransactionsBySchool;
