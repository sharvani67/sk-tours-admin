// BungalowsTable.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, HouseDoor, Eye } from 'react-bootstrap-icons';

const BungalowsTable = () => {
  const [bungalows, setBungalows] = useState([]);
  const [filteredBungalows, setFilteredBungalows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Static data based on the first image
  const staticBungalowsData = [
    {
      id: 1,
      bungalow_code: 'BUNG0001',
      name: 'Alibaug',
      price: 15400,
      location: 'Alibaug',
      bedrooms: 3,
      bathrooms: 2,
      capacity: 6,
      main_image: '/images/alibaug.jpg',
      status: 'available',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      bungalow_code: 'BUNG0002',
      name: 'Aamby Valley',
      price: 16400,
      location: 'Aamby Valley',
      bedrooms: 4,
      bathrooms: 3,
      capacity: 8,
      main_image: '/images/aamby-valley.jpg',
      status: 'available',
      created_at: '2024-01-16T11:20:00Z'
    },
    {
      id: 3,
      bungalow_code: 'BUNG0003',
      name: 'Goa',
      price: 17400,
      location: 'Goa',
      bedrooms: 3,
      bathrooms: 2,
      capacity: 6,
      main_image: '/images/goa.jpg',
      status: 'available',
      created_at: '2024-01-17T09:15:00Z'
    },
    {
      id: 4,
      bungalow_code: 'BUNG0004',
      name: 'Igatpuri',
      price: 10000,
      location: 'Igatpuri',
      bedrooms: 2,
      bathrooms: 2,
      capacity: 4,
      main_image: '/images/igatpuri.jpg',
      status: 'available',
      created_at: '2024-01-18T14:45:00Z'
    },
    {
      id: 5,
      bungalow_code: 'BUNG0005',
      name: 'Karjat',
      price: 18400,
      location: 'Karjat',
      bedrooms: 3,
      bathrooms: 3,
      capacity: 7,
      main_image: '/images/karjat.jpg',
      status: 'available',
      created_at: '2024-01-19T13:10:00Z'
    },
    {
      id: 6,
      bungalow_code: 'BUNG0006',
      name: 'Khopoli',
      price: 14400,
      location: 'Khopoli',
      bedrooms: 3,
      bathrooms: 2,
      capacity: 6,
      main_image: '/images/khopoli.jpg',
      status: 'available',
      created_at: '2024-01-20T16:30:00Z'
    },
    {
      id: 7,
      bungalow_code: 'BUNG0007',
      name: 'Kashid',
      price: 12000,
      location: 'Kashid',
      bedrooms: 2,
      bathrooms: 2,
      capacity: 4,
      main_image: '/images/kashid.jpg',
      status: 'available',
      created_at: '2024-01-21T10:00:00Z'
    },
    {
      id: 8,
      bungalow_code: 'BUNG0008',
      name: 'Lonavala',
      price: 13500,
      location: 'Lonavala',
      bedrooms: 2,
      bathrooms: 2,
      capacity: 4,
      main_image: '/images/lonavala.jpg',
      status: 'available',
      created_at: '2024-01-22T12:25:00Z'
    },
    {
      id: 9,
      bungalow_code: 'BUNG0009',
      name: 'Mahabaleshwar',
      price: 19000,
      location: 'Mahabaleshwar',
      bedrooms: 4,
      bathrooms: 3,
      capacity: 8,
      main_image: '/images/mahabaleshwar.jpg',
      status: 'available',
      created_at: '2024-01-23T15:40:00Z'
    },
    {
      id: 10,
      bungalow_code: 'BUNG0010',
      name: 'Murbad',
      price: 11000,
      location: 'Murbad',
      bedrooms: 2,
      bathrooms: 1,
      capacity: 4,
      main_image: '/images/murbad.jpg',
      status: 'available',
      created_at: '2024-01-24T09:55:00Z'
    },
    {
      id: 11,
      bungalow_code: 'BUNG0011',
      name: 'Neral',
      price: 9500,
      location: 'Neral',
      bedrooms: 2,
      bathrooms: 1,
      capacity: 4,
      main_image: '/images/neral.jpg',
      status: 'available',
      created_at: '2024-01-25T11:30:00Z'
    }
  ];

  // Fetch Bungalows (using static data for now)
  const fetchBungalows = async () => {
    try {
      setLoading(true);
      setError('');

      // For now, using static data
      // When API is ready, replace with:
      // const response = await fetch(`${baseurl}/api/bungalows`);
      // const result = await response.json();
      // const bungalowsData = result.data || result;
      
      const bungalowsData = staticBungalowsData;

      // Sort bungalows by created_at in descending order (newest first)
      const sortedBungalows = bungalowsData.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
      });

      // Add serial numbers to the data
      const bungalowsWithSerialNo = sortedBungalows.map((item, index) => ({
        ...item,
        serial_no: index + 1
      }));

      setBungalows(sortedBungalows);
      setFilteredBungalows(bungalowsWithSerialNo);
    } catch (err) {
      console.error('Error fetching bungalows:', err);
      setError('Error fetching bungalows. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBungalows();
  }, []);

  // Handle Delete Bungalow
  const handleDelete = async (bungalowId) => {
    if (!window.confirm('Are you sure you want to delete this bungalow?')) {
      return;
    }

    try {
      // When API is ready:
      // const response = await fetch(`${baseurl}/api/bungalows/${bungalowId}`, {
      //   method: 'DELETE',
      // });
      
      // For now, filter out the deleted item
      const updatedBungalows = bungalows.filter(b => b.id !== bungalowId);
      setBungalows(updatedBungalows);
      
      const updatedWithSerialNo = updatedBungalows.map((item, index) => ({
        ...item,
        serial_no: index + 1
      }));
      setFilteredBungalows(updatedWithSerialNo);
      
      alert('Bungalow deleted successfully');
    } catch (err) {
      console.error('Error deleting bungalow:', err);
      alert('Error deleting bungalow. Please try again.');
    }
  };

  // Handle Edit - Navigate to add/edit form with ID
  const handleEdit = (bungalowId) => {
    navigate(`/add-bungalow/${bungalowId}`);
  };

  // Handle View - Navigate to bungalow details page
  const handleView = (bungalowId) => {
    navigate(`/bungalow/${bungalowId}`);
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
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { class: 'success', text: 'Available' },
      booked: { class: 'danger', text: 'Booked' },
      maintenance: { class: 'warning', text: 'Maintenance' }
    };
    
    const config = statusConfig[status] || { class: 'secondary', text: status };
    return <span className={`badge bg-${config.class}`}>{config.text}</span>;
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
      key: 'bungalow_code',
      title: 'Bungalow Code',
      render: (item) => (
        <div className="d-flex align-items-center">
          <HouseDoor className="me-2 text-primary" size={16} />
          <span className="fw-bold">{item.bungalow_code || 'N/A'}</span>
        </div>
      ),
      style: { minWidth: '120px' }
    },
    {
      key: 'name',
      title: 'Bungalow Name',
      render: (item) => item.name || 'N/A',
      style: { fontWeight: '500', minWidth: '150px' }
    },
    {
      key: 'location',
      title: 'Location',
      render: (item) => item.location || 'N/A'
    },
    {
      key: 'price',
      title: 'Price/Night',
      render: (item) => (
        <span className="fw-bold text-success">
          {formatPrice(item.price)}
        </span>
      ),
      style: { textAlign: 'right', fontWeight: 'bold' }
    },
    {
      key: 'bedrooms',
      title: 'Bedrooms',
      render: (item) => (
        <span className="badge bg-info">{item.bedrooms || 0}</span>
      ),
      style: { textAlign: 'center' }
    },
    {
      key: 'bathrooms',
      title: 'Bathrooms',
      render: (item) => (
        <span className="badge bg-secondary">{item.bathrooms || 0}</span>
      ),
      style: { textAlign: 'center' }
    },
    {
      key: 'capacity',
      title: 'Capacity',
      render: (item) => (
        <span className="badge bg-warning text-dark">{item.capacity || 0} persons</span>
      ),
      style: { textAlign: 'center' }
    },
    {
      key: 'status',
      title: 'Status',
      render: (item) => getStatusBadge(item.status),
      style: { textAlign: 'center' }
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
            className="btn btn-sm btn-outline-info"
            onClick={() => handleView(item.id)}
            title="View Bungalow Details"
          >
            <Eye size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.id)}
            title="Edit Bungalow"
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.id)}
            title="Delete Bungalow"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
      style: { textAlign: 'center', minWidth: '140px' }
    }
  ];

  return (
    <Navbar>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Bungalows Management</h2>
            <p className="text-muted mb-0">
              Manage all bungalow properties, pricing, and availability
            </p>
          </div>
          <div>
            <button
              className="btn btn-success"
              onClick={() => navigate('/add-bungalow')}
            >
              <HouseDoor className="me-2" size={16} />
              + Add New Bungalow
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
              <HouseDoor className="text-primary me-2" size={20} />
              <h5 className="mb-0">Bungalows List</h5>
              <span className="badge bg-primary ms-3">
                {filteredBungalows.length} Bungalows
              </span>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="me-2" />
                Loading bungalows...
              </div>
            ) : filteredBungalows.length === 0 ? (
              <div className="text-center py-5">
                <HouseDoor size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No Bungalows Found</h5>
                <p className="text-muted mb-3">Click the "Add New Bungalow" button to create your first bungalow listing</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/add-bungalow')}
                >
                  <HouseDoor className="me-2" size={16} />
                  Add Your First Bungalow
                </button>
              </div>
            ) : (
              <ReusableTable
                title="All Bungalows"
                data={filteredBungalows}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search by code, name, or location..."
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

export default BungalowsTable;