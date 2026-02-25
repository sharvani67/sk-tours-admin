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

  // Fetch Bungalows from API
  const fetchBungalows = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/bungalows`);
      if (!response.ok) {
        throw new Error('Failed to fetch bungalows');
      }
      
      const bungalowsData = await response.json();
      console.log('Fetched bungalows:', bungalowsData); // Debug log

      // Sort bungalows by created_at in descending order (newest first)
      const sortedBungalows = [...bungalowsData].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
      });

      setBungalows(sortedBungalows);
      setFilteredBungalows(sortedBungalows);
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
      const response = await fetch(`${baseurl}/api/bungalows/${bungalowId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bungalow');
      }

      // Refresh the list after successful deletion
      fetchBungalows();
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
      1: { class: 'success', text: 'Available' },
      0: { class: 'danger', text: 'Inactive' }
    };
    
    const config = statusConfig[status] || { class: 'secondary', text: 'Unknown' };
    return <span className={`badge bg-${config.class}`}>{config.text}</span>;
  };

  // Get image display
  const getImageDisplay = (mainImage) => {
    if (!mainImage) return null;
    
    // Construct full image URL
    const imageUrl = mainImage.startsWith('http') 
      ? mainImage 
      : `${baseurl}${mainImage}`;
    
    return (
      <img
        src={imageUrl}
        alt="Bungalow"
        style={{
          width: '50px',
          height: '50px',
          objectFit: 'cover',
          borderRadius: '4px'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  };

  // Define table columns
  const columns = [
    {
      key: 'serial_no',
      title: 'S.No',
      render: (item, index) => {
        return index + 1;
      },
      style: { fontWeight: 'bold', textAlign: 'center', width: '80px' }
    },
    {
      key: 'image',
      title: 'Image',
      render: (item) => getImageDisplay(item.main_image),
      style: { textAlign: 'center', width: '80px' }
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
      key: 'tour_costs',
      title: 'Tour Costs (₹)',
      render: (item) => (
        <div className="small">
          <div>Twin: {item.per_pax_twin ? formatPrice(item.per_pax_twin) : '—'}</div>
          <div>Triple: {item.per_pax_triple ? formatPrice(item.per_pax_triple) : '—'}</div>
          <div>Child (Bed): {item.child_with_bed ? formatPrice(item.child_with_bed) : '—'}</div>
          <div>Child (No Bed): {item.child_without_bed ? formatPrice(item.child_without_bed) : '—'}</div>
          <div>Infant: {item.infant ? formatPrice(item.infant) : '—'}</div>
          <div>Single: {item.per_pax_single ? formatPrice(item.per_pax_single) : '—'}</div>
        </div>
      ),
      style: { minWidth: '200px', fontSize: '0.9rem' }
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
            onClick={() => handleView(item.bungalow_id)}
            title="View Bungalow Details"
          >
            <Eye size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.bungalow_id)}
            title="Edit Bungalow"
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.bungalow_id)}
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
          {/* <Card.Header className="bg-white py-1"> */}
            <div className="d-flex align-items-center py-3 px-3">
              <HouseDoor className="text-primary me-2" size={20} />
              <h5 className="mb-0">Bungalows List</h5>
              <span className="badge bg-primary ms-3">
                {bungalows.length} Bungalows
              </span>
            </div>
          {/* </Card.Header> */}
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="me-2" />
                Loading bungalows...
              </div>
            ) : bungalows.length === 0 ? (
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
                searchPlaceholder="Search by code or name..."
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