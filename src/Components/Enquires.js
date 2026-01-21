import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiEye, FiMail, FiPhone, FiUser, FiCalendar, 
  FiChevronDown, FiChevronUp, FiSearch, FiRefreshCw,
  FiFilter, FiDownload, FiTrash2, FiX, FiCheck, FiClock
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl } from "../Api/Baseurl";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  // Advanced filter states
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, [filter, pagination.page, dateRange]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'created_at',
        sortOrder: 'desc'
      };
      
      if (filter === 'read') params.is_read = 'true';
      if (filter === 'unread') params.is_read = 'false';
      if (searchTerm) params.search = searchTerm;
      if (dateRange.startDate && dateRange.endDate) {
        params.start_date = dateRange.startDate;
        params.end_date = dateRange.endDate;
      }

      const response = await axios.get(`${baseurl}/api/tour-enquiries`, { params });
      
      setEnquiries(response.data.enquiries);
      setPagination(response.data.pagination);
      setError(null);
      
      if (response.data.enquiries.length > 0) {
        toast.success(`Loaded ${response.data.enquiries.length} enquiries`, {
          position: "top-right",
          autoClose: 2000,
          className: 'toast-success'
        });
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setError('Failed to load enquiries. Please try again.');
      toast.error('Failed to load enquiries', {
        position: "top-right",
        autoClose: 3000,
        className: 'toast-error'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${baseurl}/api/tour-enquiries/${id}/mark-read`);
      
      // Update local state
      setEnquiries(prev => prev.map(enquiry => 
        enquiry.id === id ? { ...enquiry, is_read: 1 } : enquiry
      ));
      
      toast.success('Marked as read', {
        position: "top-right",
        autoClose: 2000,
        className: 'toast-success'
      });
    } catch (err) {
      console.error('Error marking as read:', err);
      toast.error('Failed to mark as read', {
        position: "top-right",
        autoClose: 3000,
        className: 'toast-error'
      });
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) return;
    
    try {
      await axios.delete(`${baseurl}/api/tour-enquiries/${id}`);
      
      // Update local state
      setEnquiries(prev => prev.filter(enquiry => enquiry.id !== id));
      
      toast.success('Enquiry deleted successfully', {
        position: "top-right",
        autoClose: 2000,
        className: 'toast-success'
      });
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      toast.error('Failed to delete enquiry', {
        position: "top-right",
        autoClose: 3000,
        className: 'toast-error'
      });
    }
  };

  const exportToCSV = () => {
    if (enquiries.length === 0) {
      toast.warning('No data to export', {
        position: "top-right",
        autoClose: 2000,
        className: 'toast-warning'
      });
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Tour Title', 'Tour Code', 'Message', 'Date', 'Status'];
    const csvData = enquiries.map(enquiry => [
      enquiry.id,
      `"${enquiry.name}"`,
      enquiry.email,
      enquiry.phone,
      `"${enquiry.tour_title}"`,
      enquiry.tour_code,
      `"${enquiry.message.replace(/"/g, '""')}"`,
      new Date(enquiry.created_at).toLocaleString(),
      enquiry.is_read ? 'Read' : 'Unread'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('CSV exported successfully', {
      position: "top-right",
      autoClose: 2000,
      className: 'toast-success'
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchEnquiries();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setDateRange({ startDate: '', endDate: '' });
    setShowFilters(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEnquiryStats = () => {
    const today = new Date().toDateString();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toDateString();

    return {
      total: enquiries.length,
      unread: enquiries.filter(e => !e.is_read).length,
      today: enquiries.filter(e => {
        const enquiryDate = new Date(e.created_at).toDateString();
        return today === enquiryDate;
      }).length,
      last7Days: enquiries.filter(e => {
        const enquiryDate = new Date(e.created_at);
        return enquiryDate >= weekAgo;
      }).length
    };
  };

  const stats = getEnquiryStats();

  if (loading && enquiries.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg">Loading enquiries...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 lg:p-8">
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .shadow-soft {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .shadow-hover:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        
        .status-badge {
          position: relative;
          overflow: hidden;
        }
        
        .status-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          opacity: 0.1;
        }
        
        .status-new {
          background: linear-gradient(135deg, #fef3f2, #fee2e2);
          color: #dc2626;
        }
        
        .status-new::before {
          background: linear-gradient(135deg, #dc2626, #ef4444);
        }
        
        .status-read {
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          color: #16a34a;
        }
        
        .status-read::before {
          background: linear-gradient(135deg, #16a34a, #22c55e);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          transition: all 0.3s ease;
        }
        
        .btn-success:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }
        
        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          transition: all 0.3s ease;
        }
        
        .btn-danger:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }
        
        .toast-success {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        
        .toast-error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        
        .toast-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .gradient-border {
          position: relative;
          border-radius: 0.75rem;
        }
        
        .gradient-border::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          background: linear-gradient(135deg, #3b82f6, #10b981, #8b5cf6);
          border-radius: 0.75rem;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .gradient-border:hover::before {
          opacity: 1;
        }
      `}</style>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="mt-16"
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tour Enquiries
            </h1>
            <p className="text-gray-600 mt-2">Manage all tour enquiries submitted through the website</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {loading ? 'Updating...' : `Last updated: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </span>
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Enquiries</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FiMail className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" 
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Unread</p>
                <p className="text-3xl font-bold text-red-600">{stats.unread}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <FiClock className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.unread / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Today</p>
                <p className="text-3xl font-bold text-green-600">{stats.today}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <FiCalendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.today / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Last 7 Days</p>
                <p className="text-3xl font-bold text-purple-600">{stats.last7Days}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FiUser className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.last7Days / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Filters and Actions */}
        <div className="glass-card rounded-2xl p-6 shadow-soft">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, or tour..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                  showFilters 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <FiFilter className="h-4 w-4" />
                <span className="font-medium">Filters</span>
              </button>

              <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2.5 text-sm font-medium transition-all ${
                    filter === 'all' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 ${
                    filter === 'unread' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>Unread</span>
                  {stats.unread > 0 && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      filter === 'unread' 
                        ? 'bg-white text-red-600' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {stats.unread}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-4 py-2.5 text-sm font-medium transition-all ${
                    filter === 'read' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Read ({stats.total - stats.unread})
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar className="inline-block mr-2 h-4 w-4" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar className="inline-block mr-2 h-4 w-4" />
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium shadow-sm transition-all duration-300 flex items-center gap-2"
                  >
                    <FiX className="h-4 w-4" />
                    Clear All
                  </button>
                  <button
                    onClick={fetchEnquiries}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 font-medium shadow-md transition-all duration-300 flex items-center gap-2"
                  >
                    <FiCheck className="h-4 w-4" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="glass-card rounded-2xl p-6 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchEnquiries}
                className="btn-primary px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md"
              >
                <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="btn-success px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md"
              >
                <FiDownload className="h-4 w-4" />
                Export CSV
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                Showing <span className="font-semibold text-gray-800">{enquiries.length}</span> of{' '}
                <span className="font-semibold text-gray-800">{pagination.total}</span> enquiries
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Rows per page:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <FiX className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-1">Error Loading Enquiries</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={fetchEnquiries}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enquiries Table */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Enquirer Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tour Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <FiMail className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Enquiries Found</h3>
                        <p className="text-gray-500 max-w-md">
                          {searchTerm || filter !== 'all' || dateRange.startDate || dateRange.endDate
                            ? "Try adjusting your search criteria or filters to find what you're looking for."
                            : "No enquiries have been submitted yet. Check back later!"}
                        </p>
                        {(searchTerm || filter !== 'all' || dateRange.startDate || dateRange.endDate) && (
                          <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                          >
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enquiry) => (
                    <React.Fragment key={enquiry.id}>
                      <tr className={`hover:bg-gray-50 transition-colors duration-200 ${
                        !enquiry.is_read ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50' : ''
                      }`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`status-badge px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center justify-center gap-1.5 ${
                              enquiry.is_read ? 'status-read' : 'status-new'
                            }`}>
                              {!enquiry.is_read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-subtle"></span>
                              )}
                              {enquiry.is_read ? 'Read' : 'New'}
                            </span>
                            {!enquiry.is_read && (
                              <span className="text-xs text-gray-500">Requires attention</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                              {enquiry.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-gray-900">{enquiry.name}</h4>
                                {!enquiry.is_read && (
                                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                                )}
                              </div>
                              <div className="flex flex-col gap-1 mt-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <FiMail className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                  <span className="truncate">{enquiry.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <FiPhone className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                  <span>{enquiry.phone}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                              {enquiry.tour_title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                Code: {enquiry.tour_code}
                              </span>
                              {enquiry.tour_id && (
                                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                  ID: {enquiry.tour_id}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <FiCalendar className="h-4 w-4 mr-2 text-gray-400" />
                              {formatDate(enquiry.created_at)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(enquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleRow(enquiry.id)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg hover:from-blue-100 hover:to-indigo-100 font-medium text-sm transition-all duration-300 flex items-center gap-2"
                            >
                              <FiEye className="h-4 w-4" />
                              {expandedRows[enquiry.id] ? 'Hide' : 'View'}
                              {expandedRows[enquiry.id] ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            {!enquiry.is_read && (
                              <button
                                onClick={() => markAsRead(enquiry.id)}
                                className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg hover:from-green-100 hover:to-emerald-100 font-medium text-sm transition-all duration-300 flex items-center gap-2"
                              >
                                <FiCheck className="h-4 w-4" />
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => deleteEnquiry(enquiry.id)}
                              className="p-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 rounded-lg hover:from-red-100 hover:to-pink-100 transition-all duration-300"
                              title="Delete enquiry"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row */}
                      {expandedRows[enquiry.id] && (
                        <tr>
                          <td colSpan="5" className="px-6 py-6 bg-gradient-to-r from-gray-50/50 to-blue-50/50">
                            <div className="glass-card rounded-xl p-6 shadow-inner">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FiEye className="h-4 w-4" />
                                    Enquiry Message
                                  </h4>
                                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                      {enquiry.message}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FiUser className="h-4 w-4" />
                                    Details
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                      <dl className="space-y-2">
                                        <div>
                                          <dt className="text-xs font-medium text-gray-500">Enquiry ID</dt>
                                          <dd className="text-sm font-semibold text-gray-900">#{enquiry.id}</dd>
                                        </div>
                                        <div>
                                          <dt className="text-xs font-medium text-gray-500">Tour ID</dt>
                                          <dd className="text-sm font-semibold text-gray-900">{enquiry.tour_id || 'N/A'}</dd>
                                        </div>
                                        <div>
                                          <dt className="text-xs font-medium text-gray-500">Submitted</dt>
                                          <dd className="text-sm text-gray-700">
                                            {new Date(enquiry.created_at).toLocaleDateString('en-US', {
                                              weekday: 'long',
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric'
                                            })}
                                          </dd>
                                        </div>
                                        <div>
                                          <dt className="text-xs font-medium text-gray-500">Status</dt>
                                          <dd className={`text-sm font-medium ${enquiry.is_read ? 'text-green-600' : 'text-red-600'}`}>
                                            {enquiry.is_read ? '✓ Read' : '● Unread'}
                                          </dd>
                                        </div>
                                      </dl>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => window.location.href = `mailto:${enquiry.email}`}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                      >
                                        <FiMail className="h-4 w-4" />
                                        Reply via Email
                                      </button>
                                      <button
                                        onClick={() => window.location.href = `tel:${enquiry.phone}`}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                      >
                                        <FiPhone className="h-4 w-4" />
                                        Call
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="glass-card rounded-2xl p-6 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages} •{' '}
                <span className="font-semibold text-gray-800">{pagination.total}</span> total records
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={!pagination.hasPrev}
                  className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    pagination.hasPrev
                      ? 'btn-primary shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                        className={`h-10 w-10 rounded-lg font-medium transition-all ${
                          pagination.page === pageNum
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: pagination.totalPages }))}
                        className="h-10 w-10 rounded-lg font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={!pagination.hasNext}
                  className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    pagination.hasNext
                      ? 'btn-primary shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enquiries;