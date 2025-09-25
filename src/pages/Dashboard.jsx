import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { transactionAPI } from '../utils/api';
import Navigation from '../components/Navigation';
import './Dashboard.css';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    school_id: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    pending: 0,
    failed: 0
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: pageSize,
        sort: 'payment_time',
        order: 'desc'
      };

      if (filters.status) params.status = filters.status;
      if (filters.school_id.trim()) params.school_id = filters.school_id.trim();
      if (filters.search.trim()) params.search = filters.search.trim();

      console.log('Fetching with params:', params);
      const response = await transactionAPI.getTransactions(params);
      
      if (response && response.transactions) {
        setTransactions(response.transactions);
        setTotalCount(response.pagination?.total_records || 0);
        
        setStats({
          total: response.pagination?.total_records || 0,
          success: response.transactions.filter(t => t.status === 'success').length,
          pending: response.transactions.filter(t => t.status === 'pending').length,
          failed: response.transactions.filter(t => t.status === 'failed').length
        });
        
        setError('');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
      setTransactions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, pageSize, filters.status, filters.school_id, filters.search]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
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
    },
    {
      field: 'school_id',
      headerName: 'School ID',
      width: 130,
      renderCell: (params) => (
        <div className="school-info">
          {params.value ? `${params.value.slice(0, 8)}...` : 'N/A'}
        </div>
      )
    }
  ];

  return (
    <div className="payment-dashboard">
      <Navigation />
      <div className="page-content">

      {/* Statistics Overview */}
      <div className="stats-section">
        <div className="stats-card total-transactions">
          <div className="stats-icon">📊</div>
          <div className="stats-info">
            <h3>Total Transactions</h3>
            <div className="stats-count">{stats.total}</div>
          </div>
        </div>
        <div className="stats-card successful-payments">
          <div className="stats-icon">✅</div>
          <div className="stats-info">
            <h3>Successful Payments</h3>
            <div className="stats-count">{stats.success}</div>
          </div>
        </div>
        <div className="stats-card pending-payments">
          <div className="stats-icon">⏳</div>
          <div className="stats-info">
            <h3>Pending Payments</h3>
            <div className="stats-count">{stats.pending}</div>
          </div>
        </div>
        <div className="stats-card failed-payments">
          <div className="stats-icon">❌</div>
          <div className="stats-info">
            <h3>Failed Payments</h3>
            <div className="stats-count">{stats.failed}</div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-panel">
        <div className="filter-header">
          <h3 className="filter-title">🔍 Filter Transactions</h3>
          <button 
            className="refresh-data-btn"
            onClick={fetchTransactions}
            disabled={loading}
          >
            🔄 Refresh Data
          </button>
        </div>
        
        <div className="filter-inputs">
          <div className="input-group">
            <label className="input-label">Payment Status:</label>
            <select
              className="select-input"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Show All Status</option>
              <option value="success">Successful Only</option>
              <option value="pending">Pending Only</option>
              <option value="failed">Failed Only</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">School ID:</label>
            <input
              type="text"
              className="text-input"
              placeholder="Enter specific school ID"
              value={filters.school_id}
              onChange={(e) => handleFilterChange('school_id', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Search Transactions:</label>
            <input
              type="text"
              className="text-input"
              placeholder="Search by student name, order ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          ⚠️ {error}
        </div>
      )}

      {/* Transaction Data Table */}
      <div className="transactions-table">
        <DataGrid
          rows={transactions.map((transaction, index) => ({
            id: transaction.collect_id || `payment-${index}`,
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
          className="payment-data-grid"
        />
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
