import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { transactionAPI } from '../utils/api';
import Navigation from '../components/Navigation';
import './AllTransactions.css';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    schoolId: '',
    gateway: ''
  });
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'success', label: 'Success' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  const gatewayOptions = [
    { value: '', label: 'All Gateways' },
    { value: 'razorpay', label: 'Razorpay' },
    { value: 'payu', label: 'PayU' },
    { value: 'cashfree', label: 'Cashfree' }
  ];

  const columns = [
    {
      field: 'custom_order_id',
      headerName: 'Order ID',
      width: 200,
      renderCell: (params) => (
        <div className="cell-monospace">{params.value}</div>
      )
    },
    {
      field: 'school_id',
      headerName: 'School ID',
      width: 120,
      renderCell: (params) => (
        <div className="cell-monospace">{params.value}</div>
      )
    },
    {
      field: 'student_name',
      headerName: 'Student Name',
      width: 180,
      renderCell: (params) => {
        const name = params.row.student_info?.name || params.value || 'N/A';
        return <div className="cell-name">{name}</div>;
      }
    },
    {
      field: 'order_amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <div className="cell-amount">
          {params.value ? `₹${Number(params.value).toLocaleString('en-IN')}` : 'N/A'}
        </div>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const getStatusConfig = (status) => {
          const configs = {
            success: { label: 'SUCCESS', class: 'status-success', icon: '✅' },
            pending: { label: 'PENDING', class: 'status-pending', icon: '⏳' },
            failed: { label: 'FAILED', class: 'status-failed', icon: '❌' }
          };
          return configs[status] || { label: 'UNKNOWN', class: 'status-unknown', icon: '❓' };
        };
        
        const config = getStatusConfig(params.value);
        return (
          <div className={`status-chip ${config.class}`}>
            <span className="status-icon">{config.icon}</span>
            <span className="status-text">{config.label}</span>
          </div>
        );
      }
    },
    {
      field: 'gateway',
      headerName: 'Gateway',
      width: 100,
      renderCell: (params) => (
        <div className="cell-gateway">{params.value?.toUpperCase() || 'N/A'}</div>
      )
    },
    {
      field: 'payment_time',
      headerName: 'Date',
      width: 160,
      renderCell: (params) => {
        if (!params.value) return <div className="cell-date">N/A</div>;
        try {
          const date = new Date(params.value);
          return (
            <div className="cell-date">
              <div>{date.toLocaleDateString('en-IN')}</div>
              <div className="cell-time">{date.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</div>
            </div>
          );
        } catch {
          return <div className="cell-date">{params.value}</div>;
        }
      }
    }
  ];

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...(filters.status && { status: filters.status }),
        ...(filters.dateFrom && { date_from: filters.dateFrom }),
        ...(filters.dateTo && { date_to: filters.dateTo }),
        ...(filters.schoolId && { school_id: filters.schoolId.trim() }),
        ...(filters.gateway && { gateway: filters.gateway })
      };

      console.log('Fetching transactions with params:', params);
      const response = await transactionAPI.getAllTransactions(params);
      
      if (response && response.transactions) {
        setTransactions(response.transactions);
        setTotalTransactions(response.total || response.transactions.length);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      setTransactions([]);
      setTotalTransactions(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [paginationModel]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    setPaginationModel(prev => ({ ...prev, page: 0 }));
    fetchTransactions();
  };

  const handleReset = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
      schoolId: '',
      gateway: ''
    });
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="all-transactions-page">
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">📊 All Transactions</h1>

      {/* Filters Panel */}
      <div className="filters-panel">
        <div className="filters-header">
          <h3>Filter Transactions</h3>
          <p>Use the filters below to search and filter transactions</p>
        </div>
        
        <div className="filters-grid">
          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select
              className="filter-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gateway Filter */}
          <div className="filter-group">
            <label className="filter-label">Gateway:</label>
            <select
              className="filter-select"
              value={filters.gateway}
              onChange={(e) => handleFilterChange('gateway', e.target.value)}
            >
              {gatewayOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* School ID Filter */}
          <div className="filter-group">
            <label className="filter-label">School ID:</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Enter school ID"
              value={filters.schoolId}
              onChange={(e) => handleFilterChange('schoolId', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Date From Filter */}
          <div className="filter-group">
            <label className="filter-label">From Date:</label>
            <input
              type="date"
              className="filter-input"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          {/* Date To Filter */}
          <div className="filter-group">
            <label className="filter-label">To Date:</label>
            <input
              type="date"
              className="filter-input"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? '🔄 Searching...' : '🔍 Search'}
          </button>
          <button
            className="reset-btn"
            onClick={handleReset}
            disabled={loading}
          >
            🔄 Reset Filters
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          ⚠️ {error}
        </div>
      )}

      {/* Transactions Summary */}
      <div className="transactions-summary">
        <div className="summary-item">
          <span className="summary-label">Total Transactions:</span>
          <span className="summary-value">{totalTransactions.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Current Page:</span>
          <span className="summary-value">
            {totalTransactions > 0 ? paginationModel.page + 1 : 0} of{' '}
            {Math.ceil(totalTransactions / paginationModel.pageSize) || 1}
          </span>
        </div>
      </div>

      {/* Data Grid */}
      <div className="transactions-table">
        <DataGrid
          rows={transactions}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          loading={loading}
          getRowId={(row) => row.custom_order_id || row.collect_id || Math.random()}
          paginationMode="server"
          rowCount={totalTransactions}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e8eaed',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f1f3f4',
              padding: '12px 8px',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f8f9fa',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#1a1a1a',
              borderBottom: '2px solid #e8eaed',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f8f9fa',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '2px solid #e8eaed',
              backgroundColor: '#f8f9fa',
            }
          }}
        />
      </div>

      {/* Empty State */}
      {!loading && transactions.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">📊</div>
            <h3>No Transactions Found</h3>
            <p>No transactions match your current filters</p>
            <p className="help-text">Try adjusting your search criteria or reset filters</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AllTransactions;
