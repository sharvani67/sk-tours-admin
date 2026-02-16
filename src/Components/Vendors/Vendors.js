import React, { useState, useEffect } from 'react';
import { Container, Card, Badge } from 'react-bootstrap';
import { Eye, Pencil, Trash } from 'react-bootstrap-icons';
import Navbar from "../../Shared/Navbar/Navbar";
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseurl } from "../../Api/Baseurl";

const Vendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendors from API
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseurl}/api/vendors`);
      
      // Transform API data to match your static UI structure
      const transformedData = response.data.map(vendor => ({
        id: vendor.id,
        category: vendor.category_name || 'Travel Agent',
        title: vendor.title || 'Mr.',
        firstName: vendor.first_name || '',
        lastName: vendor.last_name || '',
        email: vendor.email1 || vendor.email2 || '',
        mobileNo: vendor.mobile1 || vendor.mobile2 || '',
        pinCode: vendor.pin_code || '',
        country: vendor.country || 'India',
        city: vendor.city || '',
        isVerified: 'Verified',
        isActive: vendor.is_active // Keep as boolean for badge rendering
      }));
      
      setVendors(transformedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  // Handle view action
  const handleView = (id) => {
    navigate(`/view-vendor/${id}`);
  };

  // Handle edit action
  const handleEdit = (id) => {
    navigate(`/add-vendors/${id}`);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await axios.delete(`${baseurl}/api/vendors/${id}`);
        fetchVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
        alert('Failed to delete vendor');
      }
    }
  };

  // Columns configuration
  const columns = [
    {
      key: 'serial_no',
      title: '#',
      render: (item, index) => index + 1,
      style: { fontWeight: 'bold', textAlign: 'center', width: '50px' }
    },
    {
      key: 'category',
      title: 'Category',
      render: (item) => item.category || "N/A"
    },
    {
      key: 'name',
      title: 'Name',
      render: (item) => `${item.title} ${item.firstName} ${item.lastName}`.trim()
    },
    {
      key: 'email',
      title: 'Email',
      render: (item) => item.email || "N/A"
    },
    {
      key: 'mobileNo',
      title: 'Mobile No.',
      render: (item) => item.mobileNo || "N/A"
    },
    {
      key: 'pinCode',
      title: 'Pin Code',
      render: (item) => item.pinCode || '-'
    },
    {
      key: 'country',
      title: 'Country',
      render: (item) => item.country || "N/A"
    },
    {
      key: 'city',
      title: 'City',
      render: (item) => item.city || "N/A"
    },
    {
      key: 'isVerified',
      title: 'Is Verified',
      render: (item) => (
        <Badge 
          bg={item.isVerified === 'Verified' ? 'success' : 'warning'}
          className="px-3 py-2"
        >
          {item.isVerified}
        </Badge>
      ),
      style: { textAlign: 'center' }
    },
   {
  key: 'isActive',
  title: 'Is Active',
  render: (item) => (
    <Badge 
      bg={item.isActive == 1 || item.isActive == true ? 'success' : 'secondary'}
      className="px-3 py-2"
    >
      {item.isActive == 1 || item.isActive == true ? 'Active' : 'Inactive'}
    </Badge>
  ),
  style: { textAlign: 'center' }
},
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleView(item.id)}
            title="View"
          >
            <Eye size={16} />
          </button> */}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.id)}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.id)}
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
      style: { textAlign: 'center', minWidth: '120px' }
    }
  ];

  // Loading state
  if (loading) {
    return (
      <Navbar>
        <Container fluid className="py-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading vendors...</p>
            </Card.Body>
          </Card>
        </Container>
      </Navbar>
    );
  }

  // Error state
  if (error) {
    return (
      <Navbar>
        <Container fluid className="py-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center py-5">
              <div className="text-danger mb-3">
                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="text-danger">{error}</h5>
              <button 
                className="btn btn-primary mt-3"
                onClick={fetchVendors}
              >
                Retry
              </button>
            </Card.Body>
          </Card>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <Container fluid className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Vendors</h2>
          <button
            className="btn btn-success"
            onClick={() => navigate('/add-vendors')}
          >
            + Add New Vendor
          </button>
        </div>

        <Card className="shadow-sm">
          <Card.Body>
            <ReusableTable
              title="Vendors List"
              data={vendors}
              columns={columns}
              initialEntriesPerPage={10}
              searchPlaceholder="Search vendors by name, email, mobile..."
              showSearch={true}
              showEntriesSelector={true}
              showPagination={true}
            />
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default Vendors;