// OfflineHotelsTable.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, Building } from 'react-bootstrap-icons';
import axios from 'axios';

const OfflineHotelsTable = () => {
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // API base URL - adjust this based on your environment
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch hotels from API
  const fetchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/offline-hotels`);
      
      if (response.data.success) {
        // Add serial numbers to the data
        const hotelsWithSerial = response.data.data.map((hotel, index) => ({
          ...hotel,
          serial_no: index + 1
        }));
        setFilteredHotels(hotelsWithSerial);
      } else {
        setError('Failed to fetch hotels');
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError(err.response?.data?.message || 'Error fetching hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotels on component mount
  useEffect(() => {
    fetchHotels();
  }, []);

  // Handle Delete Hotel
  const handleDelete = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/offline-hotels/${hotelId}`);
      
      if (response.data.success) {
        alert('Hotel deleted successfully');
        // Refresh the list
        fetchHotels();
      } else {
        alert('Error deleting hotel. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting hotel:', err);
      alert(err.response?.data?.message || 'Error deleting hotel. Please try again.');
    }
  };

  // Handle Edit - Navigate to add/edit form with ID
  const handleEdit = (hotelId) => {
    navigate(`/add-offline-hotels/${hotelId}`);
  };

  // Format price with currency
  const formatPrice = (price) => {
    if (!price) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get star rating as stars
  const getStarRating = (rating) => {
    if (!rating) return '—';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Define table columns
  const columns = [
    {
      key: 'serial_no',
      title: 'S.No',
      render: (item, index) => {
        if (item.serial_no) return item.serial_no;
        if (index !== undefined) return index + 1;
        return 'N/A';
      },
      style: { fontWeight: 'bold', textAlign: 'center', width: '80px' }
    },
    {
      key: 'hotel_name',
      title: 'Hotel Name',
      render: (item) => (
        <div className="d-flex align-items-center">
          <Building className="me-2 text-primary" size={16} />
          <span className="fw-bold">{item.hotel_name || item.property_name || 'N/A'}</span>
        </div>
      ),
      style: { minWidth: '180px' }
    },
    {
      key: 'city',
      title: 'Location',
      render: (item) => (
        <span>
          {item.city || 'N/A'}, {item.country || 'IN'}
        </span>
      ),
      style: { minWidth: '120px' }
    },
    {
      key: 'star_rating',
      title: 'Rating',
      render: (item) => (
        <span className="text-warning" title={`${item.star_rating} Star`}>
          {getStarRating(item.star_rating)}
        </span>
      ),
      style: { textAlign: 'center', minWidth: '100px' }
    },
    {
      key: 'price',
      title: 'Price/Night',
      render: (item) => (
        <div>
          <span className="fw-bold text-success">
            {formatPrice(item.price)}
          </span>
          {item.sale_price && (
            <div>
              <small className="text-muted text-decoration-line-through">
                {formatPrice(item.original_price)}
              </small>
              <span className="badge bg-danger ms-1">Sale</span>
            </div>
          )}
        </div>
      ),
      style: { textAlign: 'right', fontWeight: 'bold' }
    },
    {
      key: 'rooms',
      title: 'Rooms',
      render: (item) => (
        <span className={`badge ${item.rooms > 10 ? 'bg-success' : 'bg-warning'}`}>
          {item.rooms || 0}
        </span>
      ),
      style: { textAlign: 'center' }
    },
    {
      key: 'check_dates',
      title: 'Check-in/out',
      render: (item) => (
        <div>
          <div>In: {item.check_in_date ? new Date(item.check_in_date).toLocaleDateString() : 'N/A'}</div>
          <div>Out: {item.check_out_date ? new Date(item.check_out_date).toLocaleDateString() : 'N/A'}</div>
        </div>
      ),
      style: { textAlign: 'center', minWidth: '120px' }
    },
    {
      key: 'amenities',
      title: 'Amenities',
      render: (item) => {
        if (!item.amenities) return '—';
        const amenitiesList = item.amenities.split(',').slice(0, 3);
        return (
          <span title={item.amenities}>
            {amenitiesList.join(', ')}{item.amenities.split(',').length > 3 ? '...' : ''}
          </span>
        );
      },
      style: { maxWidth: '200px' }
    },
    {
      key: 'meal_plan',
      title: 'Meal Plan',
      render: (item) => item.meal_plan_description || 'Room Only',
      style: { textAlign: 'center' }
    },
    {
      key: 'status',
      title: 'Status',
      render: (item) => {
        const status = item.status || 'Available';
        return (
          <span className={`badge ${status === 'Available' ? 'bg-success' : 'bg-warning'}`}>
            {status}
          </span>
        );
      },
      style: { textAlign: 'center' }
    },
    {
      key: 'occupancy',
      title: 'Guests',
      render: (item) => (
        <span>
          {item.adults || 0} Adults, {item.children || 0} Children
          {item.pets ? ', Pets' : ''}
        </span>
      ),
      style: { textAlign: 'center', minWidth: '120px' }
    },
    {
      key: 'created_at',
      title: 'Added On',
      render: (item) => formatDate(item.created_at)
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.id)}
            title="Edit Hotel"
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.id)}
            title="Delete Hotel"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
      style: { textAlign: 'center', minWidth: '100px' }
    }
  ];

  return (
    <Navbar>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Offline Hotels Management</h2>
            <p className="text-muted mb-0">
              Manage all offline hotel listings and details
            </p>
          </div>
          <div>
            <button
              className="btn btn-success"
              onClick={() => navigate('/add-offline-hotels')}
            >
              <Building className="me-2" size={16} />
              + Add Offline Hotel
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Card className="shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="d-flex align-items-center">
              <Building className="text-primary me-2" size={20} />
              <h5 className="mb-0">Offline Hotels List</h5>
              {!loading && (
                <span className="badge bg-primary ms-3">
                  {filteredHotels.length} Hotels
                </span>
              )}
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading hotels...</p>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-5">
                <Building size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No Offline Hotels Found</h5>
                <p className="text-muted mb-3">Click the "Add Offline Hotel" button to create your first hotel listing</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/add-offline-hotels')}
                >
                  <Building className="me-2" size={16} />
                  Add Your First Hotel
                </button>
              </div>
            ) : (
              <ReusableTable
                title="All Offline Hotels"
                data={filteredHotels}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search by hotel name, city, or location..."
                showSearch={true}
                showEntriesSelector={true}
                showPagination={true}
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default OfflineHotelsTable;