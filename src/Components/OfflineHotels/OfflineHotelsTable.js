// OfflineHotelsTable.js
import React, { useState } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, Building } from 'react-bootstrap-icons';

const OfflineHotelsTable = () => {
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Static dummy data for offline hotels
  const dummyHotels = [
    {
      id: 1,
      serial_no: 1,
      hotel_name: 'Taj Mahal Palace',
      hotel_code: 'TMP-MUM',
      city: 'Mumbai',
      country: 'India',
      address: 'Apollo Bunder, Colaba, Mumbai',
      star_rating: 5,
      room_type: 'Deluxe Ocean View',
      price_per_night: 25000,
      available_rooms: 15,
      check_in_time: '14:00',
      check_out_time: '11:00',
      amenities: 'Free WiFi, Swimming Pool, Spa, Restaurant, Gym, Room Service',
      cancellation_policy: 'Free cancellation up to 7 days before check-in',
      meal_plan: 'Breakfast Included',
      contact_number: '+91 22 6665 3366',
      email: 'reservations@tajhotels.com',
      website: 'www.tajhotels.com',
      status: 'Active',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      serial_no: 2,
      hotel_name: 'The Oberoi Udaivilas',
      hotel_code: 'OUB-UDA',
      city: 'Udaipur',
      country: 'India',
      address: 'Haridasji Ki Magri, Udaipur',
      star_rating: 5,
      room_type: 'Luxury Room with Lake View',
      price_per_night: 35000,
      available_rooms: 8,
      check_in_time: '14:00',
      check_out_time: '12:00',
      amenities: 'Free WiFi, Swimming Pool, Spa, Fine Dining, Yoga, Boat Rides',
      cancellation_policy: 'Free cancellation up to 14 days before check-in',
      meal_plan: 'Breakfast & Dinner Included',
      contact_number: '+91 294 243 3300',
      email: 'reservations.udaivilas@oberoihotels.com',
      website: 'www.oberoihotels.com',
      status: 'Active',
      created_at: '2024-02-10T09:15:00Z'
    },
    {
      id: 3,
      serial_no: 3,
      hotel_name: 'ITC Grand Chola',
      hotel_code: 'IGC-CHE',
      city: 'Chennai',
      country: 'India',
      address: 'No. 63, Mount Road, Guindy, Chennai',
      star_rating: 5,
      room_type: 'Executive Club Room',
      price_per_night: 18000,
      available_rooms: 25,
      check_in_time: '15:00',
      check_out_time: '12:00',
      amenities: 'Free WiFi, Swimming Pool, Spa, Multiple Restaurants, Gym, Business Center',
      cancellation_policy: 'Free cancellation up to 3 days before check-in',
      meal_plan: 'Breakfast Included',
      contact_number: '+91 44 2220 0000',
      email: 'reservations@itchotels.in',
      website: 'www.itchotels.com',
      status: 'Active',
      created_at: '2024-03-05T14:20:00Z'
    },
    {
      id: 4,
      serial_no: 4,
      hotel_name: 'The Leela Palace',
      hotel_code: 'TLP-DEL',
      city: 'New Delhi',
      country: 'India',
      address: 'Diplomatic Enclave, Chanakyapuri, New Delhi',
      star_rating: 5,
      room_type: 'Palace Room',
      price_per_night: 28000,
      available_rooms: 12,
      check_in_time: '14:00',
      check_out_time: '12:00',
      amenities: 'Free WiFi, Swimming Pool, Spa, Fine Dining, Butler Service, Gym',
      cancellation_policy: 'Free cancellation up to 7 days before check-in',
      meal_plan: 'Breakfast Included',
      contact_number: '+91 11 3933 1234',
      email: 'reservations.delhi@theleela.com',
      website: 'www.theleela.com',
      status: 'Active',
      created_at: '2024-01-28T11:45:00Z'
    },
    {
      id: 5,
      serial_no: 5,
      hotel_name: 'JW Marriott',
      hotel_code: 'JWM-BLR',
      city: 'Bengaluru',
      country: 'India',
      address: '24/1, Vittal Mallya Road, Bengaluru',
      star_rating: 5,
      room_type: 'Executive Suite',
      price_per_night: 22000,
      available_rooms: 10,
      check_in_time: '15:00',
      check_out_time: '12:00',
      amenities: 'Free WiFi, Swimming Pool, Spa, Multiple Restaurants, Gym, Lounge Access',
      cancellation_policy: 'Free cancellation up to 24 hours before check-in',
      meal_plan: 'Breakfast Included',
      contact_number: '+91 80 6718 9999',
      email: 'reservations.blr@marriott.com',
      website: 'www.marriott.com',
      status: 'Active',
      created_at: '2024-02-18T16:30:00Z'
    },
    {
      id: 6,
      serial_no: 6,
      hotel_name: 'The Park',
      hotel_code: 'TPK-KOL',
      city: 'Kolkata',
      country: 'India',
      address: '17, Park Street, Kolkata',
      star_rating: 4,
      room_type: 'Deluxe Room',
      price_per_night: 12000,
      available_rooms: 20,
      check_in_time: '14:00',
      check_out_time: '11:00',
      amenities: 'Free WiFi, Swimming Pool, Spa, Restaurant, Bar, Gym',
      cancellation_policy: 'Free cancellation up to 48 hours before check-in',
      meal_plan: 'Room Only',
      contact_number: '+91 33 2249 7336',
      email: 'reservations@theparkhotels.com',
      website: 'www.theparkhotels.com',
      status: 'Under Renovation',
      created_at: '2024-03-12T10:00:00Z'
    },
    {
      id: 7,
      serial_no: 7,
      hotel_name: 'Fort Jadhavgadh',
      hotel_code: 'FJH-PUN',
      city: 'Pune',
      country: 'India',
      address: 'Pune Bangalore Highway, Saswad, Pune',
      star_rating: 4,
      room_type: 'Heritage Room',
      price_per_night: 15000,
      available_rooms: 18,
      check_in_time: '13:00',
      check_out_time: '11:00',
      amenities: 'Free WiFi, Swimming Pool, Spa, Heritage Restaurant, Rooftop Dining',
      cancellation_policy: 'Free cancellation up to 5 days before check-in',
      meal_plan: 'Breakfast Included',
      contact_number: '+91 20 6675 2323',
      email: 'reservations@fortjadhavgadh.com',
      website: 'www.fortjadhavgadh.com',
      status: 'Active',
      created_at: '2024-02-22T13:15:00Z'
    },
    {
      id: 8,
      serial_no: 8,
      hotel_name: 'Novotel',
      hotel_code: 'NOV-HYD',
      city: 'Hyderabad',
      country: 'India',
      address: 'Gachibowli, Hyderabad',
      star_rating: 4,
      room_type: 'Superior Room',
      price_per_night: 9500,
      available_rooms: 35,
      check_in_time: '14:00',
      check_out_time: '12:00',
      amenities: 'Free WiFi, Swimming Pool, Restaurant, Bar, Gym, Conference Rooms',
      cancellation_policy: 'Free cancellation up to 24 hours before check-in',
      meal_plan: 'Breakfast Included',
      contact_number: '+91 40 6624 2424',
      email: 'reservations@novotel.com',
      website: 'www.novotel.com',
      status: 'Active',
      created_at: '2024-03-08T09:30:00Z'
    },
    {
      id: 9,
      serial_no: 9,
      hotel_name: 'Alila Fort Bishangarh',
      hotel_code: 'AFB-JAI',
      city: 'Jaipur',
      country: 'India',
      address: 'Bishangarh, Jaipur',
      star_rating: 5,
      room_type: 'Fort Suite',
      price_per_night: 42000,
      available_rooms: 5,
      check_in_time: '15:00',
      check_out_time: '12:00',
      amenities: 'Free WiFi, Swimming Pool, Spa, Fine Dining, Heritage Tours, Gym',
      cancellation_policy: 'Free cancellation up to 14 days before check-in',
      meal_plan: 'Breakfast & Dinner Included',
      contact_number: '+91 1582 252 700',
      email: 'reservations.bishangarh@alilahotels.com',
      website: 'www.alilahotels.com',
      status: 'Active',
      created_at: '2024-01-20T15:45:00Z'
    },
    {
      id: 10,
      serial_no: 10,
      hotel_name: 'Radisson Blu',
      hotel_code: 'RBL-AGR',
      city: 'Agra',
      country: 'India',
      address: 'Taj East Gate Road, Agra',
      star_rating: 4,
      room_type: 'Deluxe Room with Taj View',
      price_per_night: 11000,
      available_rooms: 22,
      check_in_time: '14:00',
      check_out_time: '11:00',
      amenities: 'Free WiFi, Swimming Pool, Restaurant, Bar, Rooftop Terrace with Taj View',
      cancellation_policy: 'Free cancellation up to 48 hours before check-in',
      meal_plan: 'Breakfast Included',
      contact_number: '+91 562 402 2222',
      email: 'reservations.agra@radisson.com',
      website: 'www.radissonblu.com',
      status: 'Active',
      created_at: '2024-02-05T12:00:00Z'
    }
  ];

  // Initialize state with dummy data
  useState(() => {
    setFilteredHotels(dummyHotels);
  }, []);

  // Handle Delete Hotel
  const handleDelete = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) {
      return;
    }

    try {
      // Simulate API call
      alert('Hotel deleted successfully (Static Demo)');
      // Remove from local state
      setFilteredHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
    } catch (err) {
      console.error('Error deleting hotel:', err);
      alert('Error deleting hotel. Please try again.');
    }
  };

  // Handle Edit - Navigate to add/edit form with ID
  const handleEdit = (hotelId) => {
    navigate(`/add-offline-hotel/${hotelId}`);
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
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
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
          <span className="fw-bold">{item.hotel_name || 'N/A'}</span>
        </div>
      ),
      style: { minWidth: '180px' }
    },
    {
      key: 'hotel_code',
      title: 'Hotel Code',
      render: (item) => item.hotel_code || 'N/A',
      style: { textAlign: 'center' }
    },
    {
      key: 'city',
      title: 'City',
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
      key: 'room_type',
      title: 'Room Type',
      render: (item) => item.room_type || 'N/A',
      style: { minWidth: '150px' }
    },
    {
      key: 'price_per_night',
      title: 'Price/Night',
      render: (item) => (
        <span className="fw-bold text-success">
          {formatPrice(item.price_per_night)}
        </span>
      ),
      style: { textAlign: 'right', fontWeight: 'bold' }
    },
    {
      key: 'available_rooms',
      title: 'Available Rooms',
      render: (item) => (
        <span className={`badge ${item.available_rooms > 10 ? 'bg-success' : 'bg-warning'}`}>
          {item.available_rooms || 0}
        </span>
      ),
      style: { textAlign: 'center' }
    },
    {
      key: 'check_in_out',
      title: 'Check-in/out',
      render: (item) => (
        <span>
          {item.check_in_time || '14:00'} / {item.check_out_time || '11:00'}
        </span>
      ),
      style: { textAlign: 'center' }
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
      render: (item) => item.meal_plan || 'Room Only',
      style: { textAlign: 'center' }
    },
    {
      key: 'status',
      title: 'Status',
      render: (item) => {
        const status = item.status || 'Active';
        return (
          <span className={`badge ${status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
            {status}
          </span>
        );
      },
      style: { textAlign: 'center' }
    },
    {
      key: 'contact',
      title: 'Contact',
      render: (item) => (
        <div>
          <div>{item.contact_number || 'N/A'}</div>
          <small className="text-muted">{item.email || ''}</small>
        </div>
      ),
      style: { minWidth: '150px' }
    },
    {
      key: 'created_at',
      title: 'Added On',
      render: (item) => {
        if (!item.created_at) return 'N/A';
        try {
          const date = new Date(item.created_at);
          return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } catch {
          return 'Invalid Date';
        }
      }
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
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card className="shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="d-flex align-items-center">
              <Building className="text-primary me-2" size={20} />
              <h5 className="mb-0">Offline Hotels List</h5>
              <span className="badge bg-primary ms-3">
                {filteredHotels.length} Hotels
              </span>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredHotels.length === 0 ? (
              <div className="text-center py-5">
                <Building size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No Offline Hotels Found</h5>
                <p className="text-muted mb-3">Click the "Add Offline Hotel" button to create your first hotel listing</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/add-offline-hotel')}
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
                searchPlaceholder="Search by hotel name, city, or room type..."
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