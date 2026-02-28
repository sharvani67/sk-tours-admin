import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, HouseDoor, Eye } from 'react-bootstrap-icons';

const WeekendGatewayTable = () => {
  const [gateways, setGateways] = useState([]);
  const [filteredGateways, setFilteredGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchGateways = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/weekend-gateways`);
      if (!response.ok) {
        throw new Error('Failed to fetch weekend gateways');
      }
      
      const gatewaysData = await response.json();

      const sortedGateways = [...gatewaysData].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
      });

      setGateways(sortedGateways);
      setFilteredGateways(sortedGateways);
    } catch (err) {
      console.error('Error fetching weekend gateways:', err);
      setError('Error fetching weekend gateways. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  const handleDelete = async (gatewayId) => {
    if (!window.confirm('Are you sure you want to delete this weekend gateway?')) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/weekend-gateways/${gatewayId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete weekend gateway');
      }

      fetchGateways();
      alert('Weekend Gateway deleted successfully');
    } catch (err) {
      console.error('Error deleting weekend gateway:', err);
      alert('Error deleting weekend gateway. Please try again.');
    }
  };

  const handleEdit = (gatewayId) => {
    navigate(`/add-weekend-gateway/${gatewayId}`);
  };

  const handleView = (gatewayId) => {
    navigate(`/weekend-gateway/${gatewayId}`);
  };

  const formatPrice = (price) => {
    if (!price) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      1: { class: 'success', text: 'Available' },
      0: { class: 'danger', text: 'Inactive' }
    };
    
    const config = statusConfig[status] || { class: 'secondary', text: 'Unknown' };
    return <span className={`badge bg-${config.class}`}>{config.text}</span>;
  };

  const getImageDisplay = (mainImage) => {
    if (!mainImage) return null;
    
    const imageUrl = mainImage.startsWith('http') 
      ? mainImage 
      : `${baseurl}${mainImage}`;
    
    return (
      <img
        src={imageUrl}
        alt="Weekend Gateway"
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

  const columns = [
    {
      key: 'serial_no',
      title: 'S.No',
      render: (item, index) => index + 1,
      style: { fontWeight: 'bold', textAlign: 'center', width: '80px' }
    },
    {
      key: 'image',
      title: 'Image',
      render: (item) => getImageDisplay(item.main_image),
      style: { textAlign: 'center', width: '80px' }
    },
    {
      key: 'gateway_code',
      title: 'Gateway Code',
      render: (item) => (
        <div className="d-flex align-items-center">
          <HouseDoor className="me-2 text-primary" size={16} />
          <span className="fw-bold">{item.gateway_code || 'N/A'}</span>
        </div>
      ),
      style: { minWidth: '120px' }
    },
    {
      key: 'name',
      title: 'Gateway Name',
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
            onClick={() => handleView(item.gateway_id)}
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.gateway_id)}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.gateway_id)}
            title="Delete"
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
            <h2 className="mb-1">Weekend Gateways Management</h2>
            <p className="text-muted mb-0">
              Manage all weekend gateway properties, pricing, and availability
            </p>
          </div>
          <div>
            <button
              className="btn btn-success"
              onClick={() => navigate('/add-weekend-gateway')}
            >
              <HouseDoor className="me-2" size={16} />
              + Add New Weekend Gateway
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card className="shadow-sm">
          <div className="d-flex align-items-center py-3 px-3">
            <HouseDoor className="text-primary me-2" size={20} />
            <h5 className="mb-0">Weekend Gateways List</h5>
            <span className="badge bg-primary ms-3">
              {gateways.length} Gateways
            </span>
          </div>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="me-2" />
                Loading weekend gateways...
              </div>
            ) : gateways.length === 0 ? (
              <div className="text-center py-5">
                <HouseDoor size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No Weekend Gateways Found</h5>
                <p className="text-muted mb-3">Click the "Add New Weekend Gateway" button to create your first listing</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/add-weekend-gateway')}
                >
                  <HouseDoor className="me-2" size={16} />
                  Add Your First Weekend Gateway
                </button>
              </div>
            ) : (
              <ReusableTable
                title="All Weekend Gateways"
                data={filteredGateways}
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

export default WeekendGatewayTable;