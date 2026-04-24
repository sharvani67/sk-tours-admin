import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, Building } from 'react-bootstrap-icons';
import axios from 'axios';
import { baseurl } from '../../Api/Baseurl';

// Helper function to ensure amenities is always an array
const ensureArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : value.split(',').map(a => a.trim());
    } catch (e) {
      return value.split(',').map(a => a.trim());
    }
  }
  return [];
};

// Helper function to format amenities for display
const formatAmenities = (amenities, maxItems = 3) => {
  const amenitiesArray = ensureArray(amenities);
  if (amenitiesArray.length === 0) return '—';
  
  const displayItems = amenitiesArray.slice(0, maxItems);
  const remaining = amenitiesArray.length - maxItems;
  
  return {
    display: displayItems.join(', '),
    full: amenitiesArray.join(', '),
    hasMore: remaining > 0,
    remaining
  };
};

const OfflineHotelsTable = () => {
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Format date for display - handles YYYY-MM-DD directly without timezone
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // If it's already in YYYY-MM-DD format, parse it as local date
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        // Create date in UTC to avoid timezone shifting
        const date = new Date(Date.UTC(year, month - 1, day));
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC'
        });
      }
      // Fallback for other formats
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
      return dateString;
    } catch {
      return 'Invalid Date';
    }
  };

  // Fetch hotels from API
  const fetchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${baseurl}/api/offline-hotels`);
      
      if (response.data.success) {
        // Process the data and ensure amenities is an array
        const hotelsWithSerial = response.data.data.map((hotel, index) => ({
          ...hotel,
          serial_no: index + 1,
          // Ensure amenities is an array for display
          amenities: ensureArray(hotel.amenities),
          additional_images: ensureArray(hotel.additional_images),
          children_ages: ensureArray(hotel.children_ages)
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
      const response = await axios.delete(`${baseurl}/api/offline-hotels/${hotelId}`);
      
      if (response.data.success) {
        alert('Hotel deleted successfully');
        fetchHotels();
      } else {
        alert('Error deleting hotel. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting hotel:', err);
      alert(err.response?.data?.message || 'Error deleting hotel. Please try again.');
    }
  };

  // Handle Edit
  const handleEdit = (hotelId) => {
    navigate(`/add-offline-hotels/${hotelId}`);
  };

  // Format price with currency
  const formatPrice = (price) => {
    if (!price && price !== 0) return '—';
    
    // Remove commas and parse as float
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/,/g, '')) 
      : price;
    
    if (isNaN(numericPrice)) return price;
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericPrice);
  };

  // Get star rating as stars
  const getStarRating = (rating) => {
    if (!rating) return '—';
    const stars = parseInt(rating);
    if (isNaN(stars)) return rating;
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
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
        <span className="text-warning" title={`${item.star_rating || 3} Star`}>
          {getStarRating(item.star_rating)}
        </span>
      ),
      style: { textAlign: 'center', minWidth: '100px' }
    },
    {
      key: 'pricing',
      title: 'Pricing',
      render: (item) => {
        const hasSalePrice = item.sale_price && item.sale_price !== '';
        const hasOriginalPrice = item.original_price && item.original_price !== '';
        
        return (
          <div>
            {hasSalePrice ? (
              <span className="fw-bold text-success">
                {formatPrice(item.sale_price)}
              </span>
            ) : hasOriginalPrice ? (
              <span className="fw-bold text-success">
                {formatPrice(item.original_price)}
              </span>
            ) : (
              <span className="text-muted">—</span>
            )}
            
            {hasSalePrice && hasOriginalPrice && (
              <div>
                <small className="text-muted text-decoration-line-through">
                  {formatPrice(item.original_price)}
                </small>
                <span className="badge bg-danger ms-1">Sale</span>
              </div>
            )}
            
            {item.limited_time_sale === 1 && (
              <span className="badge bg-warning text-dark mt-1">Limited Time</span>
            )}
          </div>
        );
      },
      style: { textAlign: 'right', minWidth: '130px' }
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
          <div>In: {formatDate(item.check_in_date)}</div>
          <div>Out: {formatDate(item.check_out_date)}</div>
        </div>
      ),
      style: { textAlign: 'center', minWidth: '120px' }
    },
    {
      key: 'amenities',
      title: 'Amenities',
      render: (item) => {
        const amenitiesData = formatAmenities(item.amenities, 3);
        
        if (amenitiesData === '—') return '—';
        
        return (
          <span title={amenitiesData.full}>
            {amenitiesData.display}
            {amenitiesData.hasMore && (
              <span className="text-muted ms-1">
                +{amenitiesData.remaining} more
              </span>
            )}
          </span>
        );
      },
      style: { maxWidth: '250px' }
    },
    {
      key: 'meal_plan',
      title: 'Meal Plan',
      render: (item) => {
        const mealPlan = item.meal_plan_description;
        if (!mealPlan) return <span className="text-muted">Room Only</span>;
        // Truncate if too long
        return mealPlan.length > 30 ? mealPlan.substring(0, 30) + '...' : mealPlan;
      },
      style: { textAlign: 'center', maxWidth: '150px' }
    },
    {
      key: 'status',
      title: 'Status',
      render: (item) => {
        const status = item.status || 'Available';
        let badgeClass = 'bg-success';
        if (status === 'Limited Availability') badgeClass = 'bg-warning';
        else if (status === 'Booked') badgeClass = 'bg-danger';
        else if (status === 'Under Renovation') badgeClass = 'bg-secondary';
        
        return (
          <span className={`badge ${badgeClass}`}>
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
          {item.adults || 0} A, {item.children || 0} C
          {item.pets ? ' 🐾' : ''}
        </span>
      ),
      style: { textAlign: 'center', minWidth: '100px' }
    },
    {
      key: 'created_at',
      title: 'Added On',
      render: (item) => formatDate(item.created_at),
      style: { minWidth: '100px' }
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