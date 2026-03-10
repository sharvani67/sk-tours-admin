import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, Eye, Tree } from 'react-bootstrap-icons';

const OneDayPicnicTable = () => {
  const [picnics, setPicnics] = useState([]);
  const [filteredPicnics, setFilteredPicnics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch One Day Picnics from API
  const fetchPicnics = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/one-day-picnic`);
      if (!response.ok) {
        throw new Error('Failed to fetch one day picnics');
      }
      
      const picnicsData = await response.json();
      console.log('Fetched picnics:', picnicsData);

      // Sort by created_at in descending order (newest first)
      const sortedPicnics = [...picnicsData].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
      });

      setPicnics(sortedPicnics);
      setFilteredPicnics(sortedPicnics);
    } catch (err) {
      console.error('Error fetching picnics:', err);
      setError('Error fetching one day picnics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPicnics();
  }, []);

  // Handle Delete
  const handleDelete = async (picnicId) => {
    if (!window.confirm('Are you sure you want to delete this one day picnic?')) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/one-day-picnic/${picnicId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete one day picnic');
      }

      // Refresh the list after successful deletion
      fetchPicnics();
      alert('One Day Picnic deleted successfully');
    } catch (err) {
      console.error('Error deleting one day picnic:', err);
      alert('Error deleting one day picnic. Please try again.');
    }
  };

  // Handle Edit
  const handleEdit = (picnicId) => {
    navigate(`/add-one-day-picnic/${picnicId}`);
  };

  // Handle View
  const handleView = (picnicId) => {
    navigate(`/one-day-picnic/${picnicId}`);
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
        alt="One Day Picnic"
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
      key: 'picnic_code',
      title: 'Picnic Code',
      render: (item) => (
        <div className="d-flex align-items-center">
          <Tree className="me-2 text-primary" size={16} />
          <span className="fw-bold">{item.picnic_code || 'N/A'}</span>
        </div>
      ),
      style: { minWidth: '120px' }
    },
    {
      key: 'name',
      title: 'Picnic Name',
      render: (item) => item.name || 'N/A',
      style: { fontWeight: '500', minWidth: '150px' }
    },
    {
      key: 'price',
      title: 'Price',
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
            onClick={() => handleView(item.picnic_id)}
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.picnic_id)}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.picnic_id)}
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
            <h2 className="mb-1">One Day Picnic Management</h2>
            <p className="text-muted mb-0">
              Manage all one day picnic packages, pricing, and availability
            </p>
          </div>
          <div>
            <button
              className="btn btn-success"
              onClick={() => navigate('/add-one-day-picnic')}
            >
              <Tree className="me-2" size={16} />
              + Add New Picnic
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
            <Tree className="text-primary me-2" size={20} />
            <h5 className="mb-0">One Day Picnic List</h5>
            <span className="badge bg-primary ms-3">
              {picnics.length} Picnics
            </span>
          </div>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="me-2" />
                Loading one day picnics...
              </div>
            ) : picnics.length === 0 ? (
              <div className="text-center py-5">
                <Tree size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No One Day Picnics Found</h5>
                <p className="text-muted mb-3">Click the "Add New Picnic" button to create your first one day picnic package</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/add-one-day-picnic')}
                >
                  <Tree className="me-2" size={16} />
                  Add Your First Picnic
                </button>
              </div>
            ) : (
              <ReusableTable
                title="All One Day Picnics"
                data={filteredPicnics}
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

export default OneDayPicnicTable;